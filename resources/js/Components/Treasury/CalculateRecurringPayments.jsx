import { Fragment, useEffect, useState } from 'react'
import { DateToUKLocale } from '@/Shared/Functions'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function CalculateRecurringPayments({recurringPayments, recurringPaymentsToBeMadeHook, calculatedRecurringHook, dates}) {

    const [recurringPaymentsToBeMade, setRecurringPaymentsToBeMade] = recurringPaymentsToBeMadeHook
    const [calculatedRecurring, setCalculatedRecurring] = calculatedRecurringHook
    const [lastDate, setLastDate] = useState(dates[1] ? new Date(dates[1].getFullYear(), dates[1].getMonth()+1,0) : new Date(dates[0].getFullYear(), dates[0].getMonth()+1,0))

    useEffect(() => {
        setLastDate(dates[1] ? new Date(dates[1].getFullYear(), dates[1].getMonth()+1,0) : new Date(dates[0].getFullYear(), dates[0].getMonth()+1,0))
    },[dates])

    function FrequencyOfWeekDay(day) {
        //Calculate the frequency of a given day
        //Sunday is day 0
        //get the first day we're using
        const day1 = new Date(dates[0]).getDay()
        //get difference between first occurrence of day and day1
        let diff = day + 7 - day1
        if(diff > 6) {
            diff = diff - 7
        }

        //get the total number of days and the number of days from the first occurrence of our desired day
        let diffinMs = new Date(lastDate) - new Date(dates[0])
        let numberOfDays = Math.round(diffinMs / (1000 * 60 * 60 * 24)) + 1

        let daysFromFirstOccurrence = numberOfDays - diff - 1
        let occurrences = Math.floor(daysFromFirstOccurrence / 7) + 1

        return occurrences
    }

    function FrequencyOfDayOfMonth(day) {
        //Calculate the number of years
        let firstYear = new Date(dates[0]).getFullYear()
        let lastYear = new Date(lastDate).getFullYear()
        let numberOfYears = lastYear > 2022 ? lastYear - firstYear + 1 : 1

        //calculate the number of months, whether partial or full
        let firstMonth = new Date(dates[0]).getMonth()
        let lastMonth = new Date(lastDate).getMonth()

        let numberOfMonths = lastMonth - firstMonth + 1 + ((numberOfYears - 1) * 12)

        //check if the first month contains the day
        let firstMonthContainsDay = day >= new Date(dates[0]).getDate() ? 0 : -1
        let lastMonthContainsDay = day <= new Date(lastDate).getDate() ? 0 : -1

        let occurrences = numberOfMonths + firstMonthContainsDay + lastMonthContainsDay

        return occurrences
    }
    function FrequencyOfAnnualPayments(day, month) {
        //Calculate the frequency of annual payments
        let firstYear = new Date(dates[0]).getFullYear()
        let lastYear = new Date(lastDate).getFullYear()
        let numberOfYears = lastYear > 2022 ? lastYear - firstYear + 1 : 1

        let firstMonth = new Date(dates[0]).getMonth()
        let lastMonth = new Date(lastDate).getMonth()

        let firstYearOccurrence
        if(month > firstMonth && month < lastMonth) {
            firstYearOccurrence = 1
        } else if(month == firstMonth && day >= new Date(dates[0]).getDate()) {
            firstYearOccurrence = 1
        } else if(firstMonth != lastMonth && month == lastMonth && day <= new Date(lastDate).getDate()) {
            firstYearOccurrence = 1
        } else {
            firstYearOccurrence = 0
        }

        let occurrences = firstYearOccurrence + numberOfYears - 1
        return occurrences
    }

    //Calculate the total amount paid to recurring payments as this should be added to the total
    const calculateRecurring = () => {
        if(lastDate < dates[0]) {
            setCalculatedRecurring(0)
        } else {
            setCalculatedRecurring(
                    recurringPaymentsToBeMade.reduce((a,b) => {
                        return Number(b.amount) + Number(b.uniqueAmount ?? 0) + Number(a)
                },[])
            )
        }
    }
    const recurringOccurrences = recurringPayments.map(payment => ({
            id: payment.id,
            occurrences: payment.frequency == "weekly" ? FrequencyOfWeekDay(payment.day_of_week_due) : payment.frequency == "monthly" ? FrequencyOfDayOfMonth(payment.day_of_month_due) : FrequencyOfAnnualPayments(payment.day_of_month_due, payment.month_due)
    }))

    const calculateDate = (payment, occurrence) => {
        switch(payment.frequency) {
            case 'weekly':
                return new Date(dates[0].getFullYear(), dates[0].getMonth(), 1 + payment.day_of_week_due - dates[0].getDay() + (occurrence * 7) + (payment.day_of_week_due - dates[0].getDay() <  0 ? 7 : 0))
                break;
            case 'monthly':
                return new Date(dates[0].getFullYear(), (dates[0].getMonth()+occurrence - 1), payment.day_of_month_due)
                break;
            case 'annually':
                return new Date(dates[0].getFullYear()+occurrence - 1, payment.month_due, payment.day_of_month_due)
                break;
        }
    }

    //get the number of times that a recurring payment is made in the given timeframe
    //Add the payment to the array for each time it occurs
    //this is added to the recurringPaymentsToBeMade state
    useEffect(() => {
        const mapRecurringPaymentsToBeMade = () => {
            let arr = []
            recurringOccurrences.map(x => {
                let i = 0;
                while(i < x.occurrences) {
                    i++
                    arr.push({...recurringPayments.find(y => y.id === x.id), occurrence: i, date: calculateDate(recurringPayments.find(y => y.id === x.id),i), receipt: null})
                }
            })
            setRecurringPaymentsToBeMade(arr)
        }

        mapRecurringPaymentsToBeMade()
    },[lastDate])

    useEffect(() => {
        calculateRecurring()
    },[recurringPaymentsToBeMade])

    const addAttributeToRecurringPayment = (k, e, originalIndex) => {
        setRecurringPaymentsToBeMade(
            recurringPaymentsToBeMade.map((x,i) => {
                if(i == originalIndex) {
                    if(k === 'receipt') {
                        return {...x, receipt: e.target.files[0]}
                    } 
                    if(k === 'amount') {
                        return {...x, uniqueAmount: Number(e.target.value).toFixed(2)}
                    }
                } else {
                    return x
                }
            })
        )
    }

    return (
        recurringPaymentsToBeMade.length > 0 &&
        <>
            <div className="text-xl mt-8 font-bold">Recurring Payments</div>
            <SmallTable>
                <THead>
                    <FirstTH heading="recipient" />
                    <TH heading="amount" />
                    <TH heading="date" />
                    <TH heading="receipt" />
                </THead>
                <TBody>
                    {recurringPaymentsToBeMade?.map((payment, i) => (
                        <Fragment key={payment.id + '.' + payment.occurrence}>
                            <tr>
                                <FirstTD data={payment.recipient} />
                                <TD> 
                                    {
                                        payment.amount ?? 
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            defaultValue="0.00"
                                            onChange={(e) => addAttributeToRecurringPayment('amount', e, i)}
                                        />

                                    }
                                </TD>
                                <TD data={DateToUKLocale(payment.date)} />
                                <TD>
                                    <input 
                                        type="file" 
                                        id="receipt" 
                                        name="receipt" 
                                        accept="image/*, .pdf" 
                                        onChange={(e) => addAttributeToRecurringPayment('receipt', e, i)} 
                                    />
                                </TD>
                            </tr>
                        </Fragment>
                    ))}
                </TBody>
            </SmallTable>
        </>
    )
}
