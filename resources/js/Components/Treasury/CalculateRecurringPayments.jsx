import { Fragment, useEffect, useState } from 'react'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function CalculateRecurringPayments({recurringPayments, recurringPaymentsToBeMadeHook, calculatedRecurringHook, dates}) {

    const [recurringPaymentsToBeMade, setRecurringPaymentsToBeMade] = recurringPaymentsToBeMadeHook
    const [calculatedRecurring, setCalculatedRecurring] = calculatedRecurringHook

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
        let diffinMs = new Date(dates[1]) - new Date(dates[0])
        let numberOfDays = Math.round(diffinMs / (1000 * 60 * 60 * 24)) + 1

        let daysFromFirstOccurrence = numberOfDays - diff - 1
        let occurrences = Math.floor(daysFromFirstOccurrence / 7) + 1

        return occurrences
    }

    function FrequencyOfDayOfMonth(day) {
        //Calculate the number of years
        let firstYear = new Date(dates[0]).getFullYear()
        let lastYear = new Date(dates[1]).getFullYear()
        let numberOfYears = lastYear > 2022 ? lastYear - firstYear + 1 : 1

        //calculate the number of months, whether partial or full
        let firstMonth = new Date(dates[0]).getMonth()
        let lastMonth = new Date(dates[1]).getMonth()

        let numberOfMonths = lastMonth - firstMonth + 1 + ((numberOfYears - 1) * 12)

        //check if the first month contains the day
        let firstMonthContainsDay = day >= new Date(dates[0]).getDate() ? 0 : -1
        let lastMonthContainsDay = day <= new Date(dates[1]).getDate() ? 0 : -1

        let occurrences = numberOfMonths + firstMonthContainsDay + lastMonthContainsDay

        return occurrences
    }
    function FrequencyOfAnnualPayments(day, month) {
        //Calculate the frequency of annual payments
        let firstYear = new Date(dates[0]).getFullYear()
        let lastYear = new Date(dates[1]).getFullYear()
        let numberOfYears = lastYear > 2022 ? lastYear - firstYear + 1 : 1

        let firstMonth = new Date(dates[0]).getMonth()
        let lastMonth = new Date(dates[1]).getMonth()

        let firstYearOccurrence
        if(month > firstMonth && month < lastMonth) {
            firstYearOccurrence = 1
        } else if(month == firstMonth && day >= new Date(dates[0]).getDate()) {
            firstYearOccurrence = 1
        } else if(firstMonth != lastMonth && month == lastMonth && day <= new Date(dates[1]).getDate()) {
            firstYearOccurrence = 1
        } else {
            firstYearOccurrence = 0
        }

        let occurrences = firstYearOccurrence + numberOfYears - 1
        return occurrences
    }

    //Calculate the total amount paid to recurring payments as this should be added to the total
    const calculateRecurring = () => {
        if(dates[1] < dates[0]) {
            setCalculatedRecurring(0)
        } else {
            setCalculatedRecurring(
                    recurringPayments.reduce((a,b) => {
                    if(b.frequency === 'weekly') {
                        return Number(b.amount) * Number(FrequencyOfWeekDay(b.day_of_week_due)) + Number(a)
                    } else if (b.frequency === 'monthly') {
                        return Number(b.amount) * Number(FrequencyOfDayOfMonth(b.day_of_month_due)) + Number(a)
                    } else {
                        return Number(b.amount) * Number(FrequencyOfAnnualPayments(b.day_of_month_due, b.month_due)) + Number(a)
                    }
                },[])
            )
        }
    }
    const recurringOccurrences = recurringPayments.map(payment => ({
            id: payment.id,
            occurrences: payment.frequency == "weekly" ? FrequencyOfWeekDay(payment.day_of_week_due) : payment.frequency == "monthly" ? FrequencyOfDayOfMonth(payment.day_of_month_due) : FrequencyOfAnnualPayments(payment.day_of_month_due, payment.month_due)
    }))

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
                    arr.push({...recurringPayments.find(y => y.id === x.id), occurrence: i, receipt: null})
                }
            })
            setRecurringPaymentsToBeMade(arr)
        }

        mapRecurringPaymentsToBeMade()
        calculateRecurring()
    },[dates])

    const addReceiptToRecurringPayment = (e,originalIndex) => {
        setRecurringPaymentsToBeMade(
            recurringPaymentsToBeMade.map((x,i) => {
                if(i == originalIndex) {
                    return {...x, receipt: e.target.files[0]}
                } else {
                    return x
                }
            })
        )
    }

    return (
        <>
            <div className="text-xl mt-8 font-bold">Recurring Payments</div>
            <SmallTable>
                <THead>
                    <FirstTH heading="recipient" />
                    <TH heading="amount" />
                    <TH heading="receipt" />
                </THead>
                <TBody>
                    {recurringPaymentsToBeMade?.map((payment, i) => (
                        <Fragment key={payment.id + '.' + payment.occurrence}>
                            <tr>
                                <FirstTD data={payment.recipient} />
                                <TD data={payment.amount} />
                                <TD>
                                    <input 
                                        type="file" 
                                        id="receipt" 
                                        name="receipt" 
                                        accept="image/*, .pdf" 
                                        onChange={(e) => addReceiptToRecurringPayment(e, i)} 
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
