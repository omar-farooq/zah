import { Link } from '@inertiajs/inertia-react'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function Reports({reports}) {
    return (
        <>
            <Link href={'/treasury-reports/create'}>Create Report</Link>
            <Table>
            <THead>
                <FirstTH heading='Report Start' />
                <TH heading='Report End' />
                <TH heading='Balance' />
                <LastTH />
            </THead>
            <TBody>
                {reports.map(report => (
                    <tr key={report.id}>
                        <TD data={report.start_date} />
                        <TD data={report.end_date} />
                        <TD data={report.remaining_budget} />
                        <LastTD href={'treasury-reports'} itemID={report.id} />
                    </tr>
                ))}
            </TBody>
            </Table>
        </>
    )
}
