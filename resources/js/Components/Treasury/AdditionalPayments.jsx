import { Fragment, useEffect, useState } from 'react'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function AdditionalPayments({paymentHook, totalHook}) {

    const [payables, setPayables] = paymentHook
	const [total, setTotal] = totalHook

	const getPayments = async () => {
		let res = await axios.get('/payments')
		setPayables(res.data)
	}
	
    const submitHandler = async (e) => {
		let config = { headers: { 'content-type': 'multipart/form-data' }}
        e.preventDefault()
		try {
			let res = await axios.post('/payments', 
				{
					name: e.target.name.value,
					description: e.target.description.value,
					amount: Number(e.target.amount.value).toFixed(2),
					incoming: e.target.incoming.checked == false ? 0 : 1,
					payment_date: e.target.payment_date.value,
					receipt: e.target.receipt.files[0]
				},config)
			e.target.reset()
			SuccessNotification('Success', res.data.message)
			getPayments()
		} catch(error) {
			ErrorNotification('Error', error)
		}
    }

    const removePayable = async (id) => {
		await axios.delete('/payments/'+id)
        setPayables(payables.filter(x => x.id !== id))
    }

	useEffect(() => {
		getPayments()
	},[])

    //Calculate each model's total separately
    useEffect(() => {
        setTotal(payables.reduce((a,b) => {
            if (b.incoming) {
                return a + Number(b.amount)
            } else {
                return a - Number(b.amount)
            }
        },[]))
    },[payables])

    return (
		<>
            <div className="text-xl mt-12 font-bold">Additional incomings/outgoings</div>
            {payables.length > 0 &&
                <SmallTable>
                    <THead>
                        <FirstTH heading="Payable" />
                        <TH heading="Description" />
                        <TH heading="Amount" />
                        <TH heading="Incoming or Outgoing" />
                        <TH heading="Date" />
                        <LastTH />
                    </THead>
                    <TBody>
                        {payables.map(payable => (
                            <Fragment key={payable.id}>
                                <tr>
                                    <FirstTD data={payable.name} />
                                    <TD data={payable.description} />
                                    <TD data={payable.amount} />
                                    <TD data={payable.incoming ? 'incoming' : 'outgoing'} />
                                    <TD data={payable.payment_date} />
                                    <LastTD><button onClick={() => removePayable(payable.id)}>Delete</button></LastTD>
                                </tr>
                            </Fragment>
                        ))}
                    </TBody>
                </SmallTable>
            }

            <form className={`grid grid-cols-2 ${payables.length > 0 ? 'mt-8' : 'mt-4'} bg-white p-4 md:w-2/3`} onSubmit={(e) => submitHandler(e)}>
            <div className="flex flex-col w-11/12 place-self-center">
                <label htmlFor="name">Payable Item</label>
                <input type="text" id="name" required="required" />
            </div>

            <div className="flex flex-row mt-8 ml-6">
                <div className="flex flex-row mr-2">
                    <input type="radio" id="outgoing" name="direction" value="outgoing" defaultChecked />
                    <label htmlFor="outgoing">outgoing</label>
                </div>

                <div className="flex flex-row">
                    <input type="radio" id="incoming" name="direction" value="incoming" />
                    <label htmlFor="incoming">incoming</label>
                </div>
            </div>

            <div className="flex flex-col w-11/12 place-self-center">
                <label htmlFor="payment_date">Payment Date</label>
                <input type="date" id="payment_date" name="payment_date" required="required" />
            </div>

            <div className="flex flex-col w-11/12 place-self-center">
                <label htmlFor="amount">Amount</label>
                <input type="number" step="0.01" id="amount" required="required" />
            </div>

            <div className="flex flex-col col-start-1 col-end-3 w-11/12 md:ml-6">
                <label htmlFor="description">Description</label>
                <input type="text" id="description" />
            </div>

            <div className="flex flex-col col-start-1 col-end-3 w-11/12 place-self-center">
                <label htmlFor="receipt">Receipt (optional)</label>
                <input type="file" id="receipt" name="receipt" accept="image/*, .pdf" />
            </div>

            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white col-start-1 col-end-3 mt-2 h-8 w-1/2 place-self-center">add</button>
            </form>
		</>
    )
}
