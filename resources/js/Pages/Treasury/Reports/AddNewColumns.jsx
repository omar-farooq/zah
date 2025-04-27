import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function TreasuryItemsTable() {
  const { treasuryItems, rents } = usePage().props;
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  
    console.log(rents)
    console.log(treasuryItems)
  // Payment Type Options
  const paymentTypeOptions = [
    "General",
    "Maintenance",
    "Purchases",
    "Services",
    "Interest"
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  // Handle edit button click
  const handleEdit = (item, index) => {
    setEditingRow(index);
    setEditData({
      id: item.id,
      payment_type: item.payment_type,
      date_paid: item.date_paid
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes to backend
  const handleSave = (e) => {
    if (e) e.preventDefault();
      
    router.put(route('treasury-items.update', editData.id), editData, {
      preserveScroll: true,
      onSuccess: () => {
        setEditingRow(null);
        setEditData({});
      },
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Paid from/to</th>
            <th className="px-4 py-2">Payment Type</th>
            <th className="px-4 py-2">Payment Date</th>
            <th className="px-4 py-2">Report Period</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {treasuryItems.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{formatAmount(item.amount)}</td>
              <td className="border px-4 py-2">{item.treasurable_type == 'App\\Models\\PaidRent' ? rents.find(x => x.id == item.treasurable_id)?.user?.name : ''}</td>
              
              <td className="border px-4 py-2">
                {editingRow === index && item.treasurable_type == 'App\\Models\\Payment' ? (
                  <select
                    name="payment_type"
                    value={editData.payment_type}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  >
                    {paymentTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  item.payment_type
                )}
              </td>
              
              <td className="border px-4 py-2">
                {editingRow === index ? (
                  <input
                    type="date"
                    name="date_paid"
                    value={editData.date_paid?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  formatDate(item.date_paid)
                )}
              </td>
              
              <td className="border px-4 py-2">
                {formatDate(item.treasury_report?.start_date)} - 
                {formatDate(item.treasury_report?.end_date)}
              </td>
              
              <td className="border px-4 py-2">
                {editingRow === index ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSave}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleEdit(item, index)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
