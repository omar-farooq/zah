import { useEffect, useState } from 'react'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function ViewTreasuryReport({report, rents, treasuryItems}) {

    const [receipts, setReceipts] = useState([])
    useEffect(() => {
        const getReceipts = async () => {
            let res
            treasuryItems.forEach(async item => (
                res = await axios.get('/receipts?model=' + item.treasurable_type + '&id=' +item.treasurable_id),
                res.data.length == 1 ? setReceipts([...receipts, res.data[0]]) : ''
            ))
        }
        getReceipts()
    },[])

    const ReceiptDownloadLink = (id,type) => {
        let rcpt = receipts.find(x => x.payable_id === id && x.payable_type === type)
        if(rcpt) {
            let url = "/receipts/" + rcpt.id
            return <a href={url}>Download Receipt</a>
        } else {
            return ''
        }
    }
console.log(report)
    return (
        <>
            <div>Report Start: {report.start_date.split('T')[0]}</div>
            <div>Report End: {report.end_date.split('T')[0]}</div>
            <Table>
            <THead>
                <FirstTH heading="Amount" />
                <TH heading="Type" />
                <TH heading="Source" />
                <TH heading="incoming/outcoming" />
                <TH heading="receipt" />
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
                        <TD>{ReceiptDownloadLink(item.treasurable_id, item.treasurable_type)}</TD>
                    </tr>
                ))}
                
            </TBody>
            </Table>

            <div className="mt-5">Calculated remaining budget: £{report.calculated_remaining_budget}</div>
            {report.remaining_budget != report.calculated_remaining_budget && <div>Adjusted budget: £{report.remaining_budget}</div>}
        </>
    )
}
