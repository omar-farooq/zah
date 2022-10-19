import { Fragment } from 'react'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
export default function Browse({maintenanceRequests, unapprovedRequests, auth}) {

    let authUser = ''

    if(auth.user) {
        authUser = auth.user

        let arr = []
        const userNeedsToReviewList = unapprovedRequests.reduce((allUnapproved, unapproved) => {
            if(!unapproved.approvals.find(x => x.user_id == authUser.id)) {
                arr.push(unapproved);
            }
            return arr
        },{})
    }

    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Needs your review</h2>
            <Table>
                <THead>
                    <FirstTH heading="Name" />
                    <TH heading="Cost" />
                    <TH heading="Type" />
                    <LastTH />
                </THead>
                <TBody>
                    {unapprovedRequests.map(x => 
                        <Fragment key={x.id}>
                            <tr>
                            <FirstTD data={x.required_maintenance} />
                            <TD data={x.cost} />
                            <TD data={x.type} />
                            <LastTD authUserID={authUser.id} author={x.user_id}  href={`/maintenance-requests/${x.id}`} />
                            </tr>
                        </Fragment>
                    )}
                </TBody>
            </Table>
        </>
    )
}
