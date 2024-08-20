import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Pagination } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates';
import { DateTimeToUKDate, LastDayOfTheMonth } from '@/Shared/Functions'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function Reports({reportPage1}) {

    const [reports, setReports] = useState(reportPage1)
    const [dateVal, setDateVal] = useState([null, null])

    const getReports = async (page) => {
        let res = await axios.get('/treasury-reports/?getReports=true&page='+page)
        setReports(res.data)
    }

    const generateReport = (e) => {
        e.preventDefault()
        let start_date = dateVal[0].toISOString().split('T')[0]
        let end_date = LastDayOfTheMonth(dateVal[1]).toISOString().split('T')[0]
        window.location = '/treasury-reports?start_date='+start_date+'&end_date='+end_date
    }

    return (
        <>
            <form className="sm:w-5/6 flex flex-row" onSubmit={(e) => generateReport(e)}>
                <MonthPickerInput
                    classNames={{ input: 'bg-white', root: 'm-2' }}
                    type="range"
                    label="Generate report over period of time"
                    placeholder="Pick dates range"
                    value={dateVal}
                    onChange={setDateVal}
                    mx="auto"
                    maw={400}
                />
                <button 
                    className="mt-6 ml-2 text-sm"
                >
                    Generate
                </button>
            </form>
            <Table>
            <THead>
                <FirstTH heading='Report Start' />
                <TH heading='Report End' />
                <TH heading='Balance' />
                <LastTH />
            </THead>
            <TBody>
                {reports.data.map(report => (
                    <tr key={report.id}>
                        <TD data={DateTimeToUKDate(report.start_date)} />
                        <TD data={DateTimeToUKDate(report.end_date)} />
                        <TD data={report.remaining_budget} />
                        <LastTD href={'treasury-reports'} itemID={report.id} />
                    </tr>
                ))}
            </TBody>
            </Table>
            <Pagination
                className="mt-5 mb-10"
                total={reports.last_page}
                value={reports.current_page}
                onChange={(e) => getReports(e)}
                withEdges
            />

            <Link 
                href={'/treasury-reports/create'}
                className="bg-sky-600 text-white text-lg p-2 border rounded-xl hover:bg-sky-700"
            >
                Create new report
            </Link>
        </>
    )
}
