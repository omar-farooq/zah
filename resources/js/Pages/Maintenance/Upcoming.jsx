import { DateToUKLocale, TimeToUKLocale } from '@/Shared/Functions'
import { Fragment } from 'react'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function Upcoming({maintenance}) {
    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Upcoming or In Progress Maintenance</h2>
            <Table>
                <THead>
                    <FirstTH heading="Name" />
                    <TH heading="Type" />
					<TH heading="Start date" />
					<TH heading="Start time" />
					<TH heading="Finish time" />
					<TH heading="End date" />
                    <LastTH />
                </THead>
                <TBody>
                    {maintenance.map(x => 
                        <Fragment key={x.id}>
                            <tr>
                            <FirstTD data={x.maintenance_request.required_maintenance} />
                            <TD data={x.maintenance_request.type} />
                            <TD data={DateToUKLocale(x.maintenance_request.start_date)} />
                            <TD data={x.maintenance_request.start_time.split(':')[0]+':'+x.maintenance_request.start_time.split(':')[1]} />
                            <TD data={x.maintenance_request.finish_time.split(':')[0]+':'+x.maintenance_request.finish_time.split(':')[1]} />
                            <TD data={DateToUKLocale(x.maintenance_request.end_date)} />
                            <LastTD 
                                href={"maintenance"} 
                                itemID={x.id}
                            />
                            </tr>
                        </Fragment>
                    )}
                </TBody>
            </Table>
        </>
    )
}
