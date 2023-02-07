import { FirstDayOfTheMonth, LastDayOfTheMonth } from '@/Shared/Functions'
import { useState } from 'react'
import { RangeCalendar } from '@mantine/dates'

export default function CreateReport({rents}) {

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

    return (
        <>
        <RangeCalendar value={dates} onChange={setDates} />

        <table className="table-fixed bg-white">
            <thead>
                <tr>
                    <th>Tenant</th>
                    <th>Rent Payable</th>
                    <th>Rent Paid</th>
                </tr>
                {rents.map(rent => {
                    return (
                        <tr key = {rent.user.id}>
                            <td>{rent.user.name}</td>
                            <td>{calculatePayableRent(rent.amount)}</td>
                            <td>rent paid goes here</td>
                        </tr>
                    )
                })}
            </thead>        
        </table>
        </>
    )
}
