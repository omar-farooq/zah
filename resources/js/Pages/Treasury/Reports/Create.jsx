import { FirstDayOfTheMonth, LastDayOfTheMonth } from '@/Shared/Functions'
import { useState } from 'react'
import { RangeCalendar } from '@mantine/dates'

export default function CreateReport({rents, arrears}) {

    const [dates, setDates] = useState([FirstDayOfTheMonth(), LastDayOfTheMonth()])

    function calculatePayableRent(rentPerWeek) {
        if(dates[0] && dates[1]) {
            let diffinMs = new Date(dates[1]) - new Date(dates[0])
            let numberOfDays = Math.round(diffinMs / (1000 * 60 * 60 * 24)) + 1
            let payableRent = (rentPerWeek / 7) * numberOfDays
            return payableRent
        } else {
            return "Select Dates"
        }
    }

    const [updatedArrears, setUpdatedArrears] = useState(arrears);
    const [paidRent, setPaidRent] = useState(rents.map(rent => ({
        user_id: rent.user.id,
        amount_paid: calculatePayableRent(rent.amount)
    })))

    const updatePaidRent = (userId, amount, payable) => {
        setPaidRent([...paidRent.filter(x => x.user_id !== userId), {...paidRent.find(x => x.user_id === userId), amount_paid: Number(amount)}])

        updatedArrears.find(x => x.user_id === userId) ?
            setUpdatedArrears([...updatedArrears.filter(x => x.user_id !== userId), {...updatedArrears.find(x => x.user_id === userId), amount: Number(calculatePayableRent(payable) - amount) + Number(arrears.find(x => x.user_id === userId).amount)}])

        :
            setUpdatedArrears([...updatedArrears, {user_id: userId, amount: calculatePayableRent(payable) - amount}])
    }

    return (
        <>
        <RangeCalendar value={dates} onChange={setDates} />

        <table className="table-fixed bg-white border border-collapse border-slate-300">
            <thead>
                <tr className="border border-slate-300 bg-slate-100">
                    <th>Tenant</th>
                    <th>Rent Payable</th>
                    <th>Rent Paid</th>
                    <th>Arrears</th>
                </tr>
                {rents.map(rent => {
                    return (
                        <tr key = {rent.user.id}>
                            <td>
                                {rent.user.name}
                            </td>
                            <td>
                                {calculatePayableRent(rent.amount)}
                            </td>
                            <td>
                                <input 
                                    className="w-40"
                                    defaultValue={calculatePayableRent(rent.amount)}
                                    onChange={(e) => updatePaidRent(rent.user.id, e.target.value, rent.amount)}
                                />
                            </td>
                            <td>
                                {updatedArrears?.find(x => x.user_id === rent.user.id).amount}
                            </td>
                        </tr>
                    )
                })}
            </thead>        
        </table>
        </>
    )
}
