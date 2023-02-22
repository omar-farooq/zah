import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function ViewTreasuryReport({report, rents, incomingPayments, outgoingPayments}) {
    console.log(rents)
    return (
        <>
            <Table>
            <THead>
                <FirstTH heading="Amount" />
                <TH heading="Type" />
                <TH heading="Payee" />
                <LastTH />
            </THead>
            <TBody>
                {rents.map(rent => (
                    <tr key={rent.id}>
                        <TD data={rent.amount_paid} />
                        <TD data="rent" />
                        <TD data={rent.user.name} />
                        <LastTD />
                    </tr>
                ))}
            </TBody>
            </Table>
        </>
    )
}
