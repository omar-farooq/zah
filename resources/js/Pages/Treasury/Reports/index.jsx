import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Pagination } from '@mantine/core'
import { DateTimeToUKDate } from '@/Shared/Functions'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function Reports({reportPage1}) {

    const [reports, setReports] = useState(reportPage1)

    const getReports = async (page) => {
        let res = await axios.get('/treasury-reports/?getReports=true&page='+page)
        setReports(res.data)
    }

    return (
        <>
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
