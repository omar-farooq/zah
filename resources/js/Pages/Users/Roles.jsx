import { Fragment } from 'react'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
export default function Roles({members}) {
    console.log(members)
    return (
        <Table>
            <THead>
                <FirstTH heading="Name" />
                <TH heading="Role" />
                <TH heading="Delegated Role" />
                <LastTH />
            </THead>
            <TBody>
                {members.map(member =>
                    <Fragment key={member.id}>
                        <tr>
                            <FirstTD data={member.name} />
                            <TD data={member.role} />
                            <TD data={member.delegated_role} />
                        </tr>
                    </Fragment>
                )}
            </TBody>
        </Table>
    )
}
