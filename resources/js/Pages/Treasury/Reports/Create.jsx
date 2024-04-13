import { Button } from '@mantine/core'
import { AdditionalPayments, CalculateAccountBalance, CalculateRecurringPayments, PurchasesAndServices } from '@/Components/Treasury'
import { FirstDayOfTheMonth, LastDayOfTheMonth, NumberOfMonths } from '@/Shared/Functions'
import { Fragment, useEffect, useReducer, useState } from 'react'
import { MonthPicker } from '@mantine/dates'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function CreateReport({rents, arrears, accounts, defaultAccounts, previousReport, recurringPayments, unreported}) {

    //Get when the previous report ended and make the start date of the report the previous day +1 by default
    let previousReportEnd = previousReport ? new Date(previousReport.end_date) : new Date(new Date().getFullYear(), new Date().getMonth()-1,0)
    let newReportDefaultStart = new Date(previousReportEnd.getFullYear(), previousReportEnd.getMonth(), previousReportEnd.getDate()+1)

    const [dates, setDates] = useState([newReportDefaultStart, LastDayOfTheMonth()])
    const [updatedArrears, setUpdatedArrears] = useState(arrears);
    const [paidRent, setPaidRent] = useState(rents.map(rent => ({
        user_id: rent.user.id,
        amount_paid: calculatePayableRent(rent.amount)
    })))

    const [additionalPayments, setAdditionalPayments] = useState([])
    const [additionalPaymentsTotal, setAdditionalPaymentsTotal] = useState(0)
    const [recurringPaymentsToBeMade, setRecurringPaymentsToBeMade] = useState([])
    const [calculatedRecurring, setCalculatedRecurring] = useState('')

    const [accountBalances, setAccountBalances] = useState(accounts.map(x => ({
        id: x.id,
        calculated: 0,
        final: null,
        changeReason: '',
    })))
    const [calculatedTotalBalance, setCalculatedTotalBalance] = useState(0)
    const [calculatedFinalBalance, setCalculatedFinalBalance] = useState(0)

    //For displaying purchases and services and adding receipts
    function unreportedReducer(unreportedItems, action) {
        switch (action.type) {
			case 'map':
				return [...unreportedItems, {id: action.id, name: action.name, price: action.price, model: action.model, modelId: action.modelId, receipt: action.receipt}]
            case 'addReceipt':
                return unreportedItems.map(x => {
                    if(x.id == action.id) {
                        return {...x, receipt: action.file}
                    } else {
                        return x
                    }
                })
            default:
                throw new Error()
        }
    }

    //Update arrears when the dates change
    useEffect(() => {
        setUpdatedArrears(arrears)
    },[dates])

    const [unreportedItems, dispatch] = useReducer(unreportedReducer, [])
   
    function calculatePayableRent(rentPerMonth) {
        if (NumberOfMonths(dates[0],dates[1]) > 0) {
            return (NumberOfMonths(dates[0],dates[1]) * rentPerMonth).toFixed(2)
        } else {
            return "Select Months"
        }
    }

    useEffect(() => {
        setPaidRent(
            rents.map(rent => ({
                user_id: rent.user.id,
                amount_paid: calculatePayableRent(rent.amount)
            }))
        )
    },[dates])

    const updateSinglePaidRent = (userId, amount, payable) => {
        setPaidRent([...paidRent.filter(x => x.user_id !== userId), {...paidRent.find(x => x.user_id === userId), amount_paid: Number(amount).toFixed(2)}])

        updatedArrears.find(x => x.user_id === userId) ?
            setUpdatedArrears([...updatedArrears.filter(x => x.user_id !== userId), {...updatedArrears.find(x => x.user_id === userId), amount: (Number(calculatePayableRent(payable) - amount) + Number(arrears.find(x => x.user_id === userId).amount)).toFixed(2)}])

        :
            setUpdatedArrears([...updatedArrears, {user_id: userId, amount: (calculatePayableRent(payable) - amount).toFixed(2)}])
    }

    // Calculate each model's total separately
    const rentTotal = paidRent.reduce((a,b) => {
        return Number(a) + Number(b.amount_paid)
    },[])

    let purchasesTotal = 0
    let servicesTotal = 0
    if(unreported.length > 0) {
        const purchasesTotal = unreported.reduce((a,b) => {
            if(b.treasurable_type == 'App\\Models\\Purchase') {
                return Number(a) + Number(b.amount)
            } else {
                return Number(a)
            }
        },[])

        const servicesTotal = unreported.reduce((a,b) => {
            if(b.treasurable_type == 'App\\Models\\Maintenance') {
                return Number(a) + Number(b.amount)
            } else {
                return Number(a)
            }
        },[])
    }

    //return the TOTAL balance for all accounts
    useEffect(() => {
        setCalculatedTotalBalance(
            accountBalances.reduce((a,b) => Number(a) + Number(b.calculated),0).toFixed(2)
        )
        setCalculatedFinalBalance(
            accountBalances.reduce((a,b) => Number(a) + Number(b.final ?? b.calculated),0).toFixed(2)
        )
    },[accountBalances])
    const submitReport = async (e) => {
        let config = { headers: { 'content-type': 'multipart/form-data' }}
        let reportID = await axios.post('/treasury-reports', {
            start_date: dates[0],
            end_date: dates[1] ? LastDayOfTheMonth(dates[1]) : LastDayOfTheMonth(dates[0]),
            calculated_remaining_budget: calculatedTotalBalance,
            remaining_budget: calculatedFinalBalance,
            paid_rents: paidRent,
            accounts_balances: accountBalances,
            recurring: recurringPaymentsToBeMade,
            unreported: unreportedItems,
            payables: additionalPayments,
            arrears: updatedArrears,
        })

        //Add receipts for Purchases and Services
        await Promise.all(unreportedItems.map(async (item) => (
            item.receipt instanceof File ?
                await axios.post('/treasury-reports?treasurable=unreported', item, config)
            : ''
        )))

        //Create each recurring payment as a treasurable
        await Promise.all(recurringPaymentsToBeMade.map(async (recurring) => (
            await axios.post('/treasury-reports?treasurable=recurring', {
                ...recurring,
                treasuryReportID: reportID.data
        },config))))

        window.location = "/treasury-reports/"+reportID.data
    }

    return (
        <>
            <div className="sm:hidden">
                <MonthPicker
                    type="range"
                    allowSingleDateInRange
                    value={dates} 
                    onChange={setDates} 
                    minDate={previousReport ? newReportDefaultStart : ''}
                    maxDate={LastDayOfTheMonth()}
                    styles={{ 
                        calendar: { width: '300px', backgroundColor: 'white', marginTop: '20px' },
                        calendarHeader: { width: '300px' },
                        calendarHeaderControl: { minWidth: '100px' },
                        calendarHeaderControlIcon: { minWidth: '100px' },
                        calendarHeaderLevel: { minWidth: '100px' },
                        decadeLevelGroup: { width: '300px' },
                        decadeLevel: { width: '300px' },
                        monthsList: { width: '300px' },
                        monthsListCell: { width: '300px' },
                        monthsListRow: { width: '300px' },
                        pickerControl: { width: '100px' },
                        yearLevel: { minWidth: '100px' },
                        yearLevelGroup: { minWidth: '100px' },
                        yearsList: { minWidth: '100px' },
                        yearsListRow: { minWidth: '100px' },
                        yearsListCell: { minWidth: '100px' },
                    }}
                />
            </div>

            <div className="hidden sm:block">
                <MonthPicker
                    type="range"
                    allowSingleDateInRange
                    value={dates} 
                    onChange={setDates} 
                    minDate={previousReport ? newReportDefaultStart : ''}
                    maxDate={LastDayOfTheMonth()}
                    styles={{ 
                        calendar: { width: '600px', backgroundColor: 'white', marginTop: '20px' },
                        calendarHeader: { width: '600px' },
                        calendarHeaderControl: { minWidth: '200px' },
                        calendarHeaderControlIcon: { minWidth: '200px' },
                        calendarHeaderLevel: { minWidth: '200px' },
                        decadeLevelGroup: { width: '600px' },
                        decadeLevel: { width: '600px' },
                        monthsList: { width: '600px' },
                        monthsListCell: { width: '600px' },
                        monthsListRow: { width: '600px' },
                        pickerControl: { width: '200px' },
                        yearLevel: { minWidth: '200px' },
                        yearLevelGroup: { minWidth: '200px' },
                        yearsList: { minWidth: '200px' },
                        yearsListRow: { minWidth: '200px' },
                        yearsListCell: { minWidth: '200px' },
                    }}
                />
            </div>

            <div className="text-xl mt-4 mb-4 font-bold">Rents Paid</div>
            <table className="table-fixed bg-white border border-collapse border-slate-300">
                <thead>
                    <tr className="border border-slate-300 bg-slate-100">
                        <th className="sm:w-32">Tenant</th>
                        <th className="sm:w-32">Rent Payable</th>
                        <th className="sm:w-32">Rent Paid</th>
                        <th className="sm:w-32">Arrears</th>
                    </tr>
                    {rents.map(rent => {
                        return (
                            <tr key = {rent.user.id} className="text-center">
                                <td>
                                    {rent.user.name}
                                </td>
                                <td>
                                    {calculatePayableRent(rent.amount)}
                                </td>
                                <td>
                                    <input 
                                        className="w-40 border-0 text-center"
                                        type="number"
                                        step="0.01"
                                        value={paidRent.find(x => x.user_id === rent.user.id).amount_paid}
                                        onChange={(e) => updateSinglePaidRent(rent.user.id, e.target.value, rent.amount)}
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

        
            <PurchasesAndServices
                unreported={unreported}
                itemReducer={[unreportedItems, dispatch]}
				reducerFunction={unreportedReducer}
            />

            <AdditionalPayments
                paymentHook={[additionalPayments, setAdditionalPayments]}
                totalHook={[additionalPaymentsTotal, setAdditionalPaymentsTotal]}
            />


            <div className="mt-10 w-full flex flex-col items-center">
                <div className="text-xl font-bold">Balance</div>
                <SmallTable>
                    <THead>
                        <FirstTH heading="Account" />
                        <TH heading="Starting" />
                        <TH heading="Calculated" />
                        <TH heading="Use Calculated" />
                        <TH heading="Final" />
                    </THead>
                    <TBody>
                        {accounts.map(x => ( 
                            <CalculateAccountBalance 
                                key={x.id} 
                                account={x}
                                rentTotal={defaultAccounts.find(y => y.account_id === x.id && y.model == 'App\\Models\\PaidRent') ? rentTotal : 0}
                                purchasesTotal={defaultAccounts.find(y => y.account_id === x.id && y.model == 'App\\Models\\Purchase') ? purchasesTotal : 0}
                                servicesTotal={defaultAccounts.find(y => y.account_id === x.id && y.model == 'App\\Models\\Maintenance') ? servicesTotal : 0}
                                recurringTotal={defaultAccounts.find(y => y.account_id === x.id && y.model == 'App\\Models\\RecurringPayment') ? calculatedRecurring : 0}
                                additionalPaymentsTotal={defaultAccounts.find(y => y.account_id === x.id && y.model == 'App\\Models\\Payment') ? additionalPaymentsTotal : 0}
                                balanceHook={[accountBalances, setAccountBalances]}
                            />
                        ))}
                        <tr>
                            <FirstTD>
                                <span className="font-bold">Total</span>
                            </FirstTD>
                            <TD>
                                £{accounts.reduce((a,b) => 
                                    Number(a) + Number(b.treasury_reports[0]?.pivot.account_balance ?? b.starting_balance),0
                                ).toFixed(2)}
                            </TD>
                            <TD 
                                data={'£' + calculatedTotalBalance} 
                            />
                            <TD 
                                data={''} 
                            />
                            <TD>
                                <span className="font-bold">{'£' + calculatedFinalBalance}</span>
                            </TD>
                        </tr>
                
                    </TBody>
                </SmallTable>


            </div>

            <Button 
                className="bg-white border-blue-400 text-blue-400 hover:text-white hover:bg-sky-600 mt-12 mb-8"
                onClick={(e) => submitReport(e)}
            >
                Submit Report
            </Button>
        </>
    )
}
