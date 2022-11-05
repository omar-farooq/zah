import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
import { Fragment } from 'react'

export default function ListMinutes ({meetings}) {
    return (
        <>
            <Table>
                <THead>
                    <FirstTH heading="Meeting Date" />
                    <LastTH />
                </THead>
                <TBody>
                    {meetings.map(meeting =>
                        <Fragment key={meeting.id}>
                            <tr>
                                <FirstTD data={meeting.time_of_meeting} />
                                <LastTD href={"/meetings/"+meeting.id} />
                            </tr>
                        </Fragment>
                    )}
                </TBody>
            </Table>
        </>
    )
}
