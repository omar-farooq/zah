import { useEffect, useReducer, useState } from 'react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { DateTimeToUKDate } from '@/Shared/Functions'
import { Loader } from '@mantine/core';
import Select from 'react-select'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function ViewTreasuryReport({report, rents, treasuryItems, previousBudget}) {

    function init(treasuryItems) {
        return treasuryItems
    }
    
    function reducer(filteredTreasuryItems, filter) {
        switch (filter.type) {
            case 'incoming':
                return treasuryItems.filter(x => x.is_incoming == 1) 
            case 'outgoing':
                return treasuryItems.filter(x => x.is_incoming == 0) 
            case 'rent':
                return treasuryItems.filter(x => x.treasurable_type == "App\\Models\\PaidRent")
            case 'reset':
                return init(filter.payload)
            default:
                throw new Error()
        }
    }

    const [filteredTreasuryItems, dispatch] = useReducer(reducer, treasuryItems, init)

    const [receipts, setReceipts] = useState([])
    const [mappedTreasuryItems, setMappedTreasuryItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getReceipts = async () => {
            let arr = []
            for (let item of treasuryItems) {
                let res = await axios.get('/receipts?model=' + item.treasurable_type + '&id=' +item.treasurable_id)
                res.data.length == 1 ? arr.push(res.data[0]) : ''
            }
            setReceipts(arr)
        }
        getReceipts()
    },[])

    useEffect(() => {
        const mapTreasuryItems = async () => {
            let arr = []
            for (let item of treasuryItems) {
                let sourceOrRecipient = await axios.get('/treasury-reports?find=sourceOrRecipient&type='+item.treasurable_type+'&id='+item.treasurable_id)
                arr.push({
                id: item.id,
                type: item.treasurable_type,
                sourceOrRecipient: sourceOrRecipient.data,
                friendly_type: item.treasurable_type == 'App\\Models\\PaidRent' ? 'Rent'
                : item.treasurable_type == 'App\\Models\\Payment' ? 'Payment'
                : item.treasurable_type == 'App\\Models\\PaidRecurringPayment' ? 'Recurring Payment'
                : item.treasurable_type == 'App\\Models\\Purchase' ? 'Purchase'
                : item.treasurable_type == 'App\\Models\\Maintenance' ? 'Maintenance'
                : ''
                })
            }
                setMappedTreasuryItems(arr)
                setLoading(!loading)
        }                    
        mapTreasuryItems()
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

    const getFriendlyName = (type) => {
        return mappedTreasuryItems.map(x => x.type == type ? 
            x.friendly_type
         : '')
    }

    return (
        loading ?
            <Loader color="cyan" size="xl" className="mt-40" />
            :
        <>
            <div className="flex flex-row mt-4">
                <div className="bg-white text-sm md:text-xl mr-4">Report Start: {DateTimeToUKDate(report.start_date)}</div>
                <ArrowLongRightIcon className="h-6 w-6" />
                <div className="bg-white text-sm md:text-xl ml-4">Report End: {DateTimeToUKDate(report.end_date)}</div>
            </div>
            <div>Starting Balance: £{previousBudget}</div>
            <div className="w-full flex flex-col items-center">
                <div className="w-4/6">
                    <Select
                        className="w-full md:w-1/2 lg:w-1/4"
                        placeholder="Filter"
                        isClearable
                        options={[
                            {value: 'incoming', label: 'Incoming'},
                            {value: 'outgoing', label: 'Outgoing'},
                            {value: 'rent', label: 'Type: Rent'},
                        ]}
                        onChange={(e) => e ? dispatch({type: e.value}) : dispatch({type: 'reset', payload: treasuryItems})}
                    />
                </div>
                <Table>
                <THead>
                    <FirstTH heading="Amount" />
                    <TH heading="Type" />
                    <TH heading="Direction" />
                    <TH heading="Source/Recipient" />
                    <TH heading="Receipt" />
                </THead>
                <TBody>
                    {filteredTreasuryItems.map(item => (
                        <tr key={item.id} className={`${item.is_incoming ? 'bg-white' : 'bg-white'}`}>
                            <FirstTD>£{item.amount}</FirstTD>
                            <TD>
                                    {
                                        getFriendlyName(item.treasurable_type)
                                    }
                            </TD>
                            <TD>{item.is_incoming ? 'incoming' : 'outgoing'}</TD>
                            <TD>
                                {
                                    item.treasurable_type === 'App\\Models\\PaidRent' ? rents.find(rent => rent.id === item.treasurable_id).user.name
                                    : mappedTreasuryItems.map(x => x.id == item.id ? x.sourceOrRecipient : '')
                                }
                            </TD>
                            <TD>{ReceiptDownloadLink(item.treasurable_id, item.treasurable_type)}</TD>
                        </tr>
                    ))}
                    
                </TBody>
                </Table>
            </div>

            <div className="mt-5 text-2xl">Calculated remaining budget: £{report.calculated_remaining_budget}</div>
            {report.remaining_budget != report.calculated_remaining_budget && <div>Adjusted budget: £{report.remaining_budget}</div>}
        </>
    )
}
