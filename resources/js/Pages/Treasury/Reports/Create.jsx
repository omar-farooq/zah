import { Button } from '@mantine/core'
import { CalculateRecurringPayments } from '@/Components/Treasury'
import { FirstDayOfTheMonth, LastDayOfTheMonth } from '@/Shared/Functions'
import { Fragment, useEffect, useState } from 'react'
import { RangeCalendar } from '@mantine/dates'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function CreateReport({rents, arrears, previousReport, recurringPayments, unreported}) {

    function calculatePayableRent(rentPerWeek) {
        if(dates[0] && dates[1]) {
            let diffinMs = new Date(dates[1]) - new Date(dates[0])
            let numberOfDays = Math.round(diffinMs / (1000 * 60 * 60 * 24)) + 1
            let payableRent = (rentPerWeek / 7) * numberOfDays
            return payableRent.toFixed(2)
        } else {
            return "Select Dates"
        }
    }

    let previousReportEnd = new Date(previousReport.end_date)
    let newReportDefaultStart = new Date(previousReportEnd.getFullYear(), previousReportEnd.getMonth(), previousReportEnd.getDate()+1)
    const [dates, setDates] = useState([newReportDefaultStart, LastDayOfTheMonth()])
    const [updatedArrears, setUpdatedArrears] = useState(arrears);
    const [paidRent, setPaidRent] = useState(rents.map(rent => ({
        user_id: rent.user.id,
        amount_paid: ''
    })))

    const [payables, setPayables] = useState([])
    const [recurringPaymentsToBeMade, setRecurringPaymentsToBeMade] = useState([])
    const [calculatedRecurring, setCalculatedRecurring] = useState('')

    const [adjustedBalance, setAdjustedBalance] = useState('')
    const [calculatedBalanceCheckbox, setCalculatedBalanceCheckbox] = useState(true)
    const [manualBalance, setManualBalance] = useState(null)

    const updatePaidRent = (userId, amount, payable) => {
        setPaidRent([...paidRent.filter(x => x.user_id !== userId), {...paidRent.find(x => x.user_id === userId), amount_paid: Number(amount)}])

        updatedArrears.find(x => x.user_id === userId) ?
            setUpdatedArrears([...updatedArrears.filter(x => x.user_id !== userId), {...updatedArrears.find(x => x.user_id === userId), amount: (Number(calculatePayableRent(payable) - amount) + Number(arrears.find(x => x.user_id === userId).amount)).toFixed(2)}])

        :
            setUpdatedArrears([...updatedArrears, {user_id: userId, amount: (calculatePayableRent(payable) - amount).toFixed(2)}])
    }

    const addInOut = (e) => {
        e.preventDefault()
        setPayables([
            ...payables, 
            {
                key: payables.length > 0 ? payables[payables.length-1].key + 1 : 0, 
                name: e.target.name.value, 
                description: e.target.description.value, 
                amount: e.target.amount.value, 
                incoming: e.target.incoming.checked, 
                payment_date: e.target.payment_date.value,
                receipt: e.target.receipt.files[0]
            }
        ])
        e.target.reset()
    }

    const removePayable = (id) => {
        setPayables(payables.filter(x => x.key !== id))
    }

    function calculateBalance() {
        const payableTotal = payables.reduce((a,b) => {
            if (b.incoming) {
                return a + Number(b.amount)
            } else {
                return a - Number(b.amount)
            }
        },[])

        const rentTotal = paidRent.reduce((a,b) => {
            return a + Number(b.amount_paid)
        },[])

        return Number(payableTotal) + Number(rentTotal) + Number(previousReport.remaining_budget) - Number(calculatedRecurring)
    }

    const submitReport = async (e) => {
        //Post rent, treasurables without a meeting id to the backend
        let config = { headers: { 'content-type': 'multipart/form-data' }}
        let reportID = await axios.post('/treasury-reports', {
            start_date: dates[0],
            end_date: dates[1],
            calculated_remaining_budget: calculateBalance(),
            remaining_budget: manualBalance ?? calculateBalance(),
            paid_rents: paidRent,
            //add maintenance/purchase treasurables
        })

        //Create each Payment
        payables.forEach(payable => (
            axios.post('/payments', {
                ...payable,
                incoming: payable.incoming == false ? 0 : 1,
                treasuryReportID: reportID.data
            },
            config
        )))
    }


    console.log(unreported)
    return (
        <>
        <RangeCalendar 
            value={dates} 
            onChange={setDates} 
            minDate={newReportDefaultStart}
        />

        <div className="text-xl mt-4 mb-4 font-bold">Rents Paid</div>
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

        <CalculateRecurringPayments 
            recurringPayments={recurringPayments}
            dates={dates}
            recurringPaymentsToBeMadeHook={[recurringPaymentsToBeMade, setRecurringPaymentsToBeMade]}
            calculatedRecurringHook={[calculatedRecurring, setCalculatedRecurring]}
        />

        
        <div className="text-xl mt-12 font-bold">Purchases and Services</div>
        <SmallTable>
            <THead>
                <FirstTH heading="Type" />
                <TH heading="Amount" />
                <LastTH />
            </THead>
            <TBody>
                {unreported.map(x => (
                    <Fragment key={x.id}>
                        <tr>
                            <FirstTD data={x.treasurable_type} />
                            <TD data={x.amount} />
                            <LastTD>view link goes here</LastTD>
                        </tr>
                    </Fragment>
                ))}
            </TBody>
        </SmallTable>

            <div className="text-xl mt-12 font-bold">Additional incomings/outgoings</div>
                <form className="grid grid-cols-2" onSubmit={(e) => addInOut(e)}>
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
                    <input type="date" id="payment_date" name="payment_date" />
                </div>

                <div className="flex flex-col w-11/12 place-self-center">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" step="0.01" id="amount" required="required" />
                </div>

                <div className="flex flex-col col-start-1 col-end-3 w-11/12 ml-2">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" />
                </div>

                <div className="flex flex-col col-start-1 col-end-3 w-11/12 place-self-center">
                    <label htmlFor="receipt">Receipt (optional)</label>
                    <input type="file" id="receipt" name="receipt" accept="image/*, .pdf" />
                </div>

                <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white col-start-1 col-end-3 mt-2 h-8 w-1/2 place-self-center">add</button>
            </form>

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
                    <Fragment key={payable.key}>
                        <tr>
                            <FirstTD data={payable.name} />
                            <TD data={payable.description} />
                            <TD data={payable.amount} />
                            <TD data={payable.incoming ? 'incoming' : 'outgoing'} />
                            <TD data={payable.payment_date} />
                            <LastTD><button onClick={() => removePayable(payable.key)}>Delete</button></LastTD>
                        </tr>
                    </Fragment>
                ))}
            </TBody>
        </SmallTable>

        <div className="mt-10">
            Starting balance: £{previousReport.remaining_budget}<br />
            Calculated remaining balance: £{calculateBalance()}

            <div>
                <input 
                    type="checkbox" 
                    id="calculated-balance-checkbox"
                    checked={calculatedBalanceCheckbox} 
                    onChange={() => setCalculatedBalanceCheckbox(!calculatedBalanceCheckbox)} 
                /> 
                <label htmlFor="calculated-balance-checkbox" className="ml-1">Use Calculated Balance</label>
            </div>

            {!calculatedBalanceCheckbox && 
                <>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="set-balance">Set a new balance manually:</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            id="set-balance" 
                            onChange={(e) => setManualBalance(e.target.value)} 
                        />
                    </div>
                </>
            }
        </div>

        <Button 
            className="bg-white border-blue-400 text-blue-400 hover:text-white hover:bg-sky-600 mt-4"
            onClick={(e) => submitReport(e)}
        >
            Submit Report
        </Button>
        </>
    )
}
