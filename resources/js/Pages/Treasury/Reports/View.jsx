import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function ViewTreasuryReport({report, rents, treasuryItems}) {
    return (
        <>
            <Table>
            <THead>
                <FirstTH heading="Amount" />
                <TH heading="Type" />
                <TH heading="Source" />
                <TH heading="incoming/outcoming" />
            </THead>
            <TBody>
                {treasuryItems.map(item => (
                    <tr key={item.id} className={`${item.is_incoming ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TD>{item.amount}</TD>
                        <TD>{item.treasurable_type == 'App\\Models\\PaidRent' ? 'Rent' : item.treasurable_type == 'App\\Models\\Payment' ? 'Payment' : 'other'}</TD>
                        <TD>
                            {
                                item.treasurable_type === 'App\\Models\\PaidRent' ? rents.find(rent => rent.id === item.treasurable_id).user.name
                                : ''
                            }
                        </TD>
                        <TD>{item.is_incoming ? 'incoming' : 'outgoing'}</TD>
                    </tr>
                ))}
                
            </TBody>
            </Table>
        </>
    )
}
