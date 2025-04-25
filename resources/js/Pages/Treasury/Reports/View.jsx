import { useEffect, useReducer, useState } from 'react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { DateTimeToUKDate } from '@/Shared/Functions'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import { Button, Group, HoverCard, Loader, Modal, Text, FileInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import Select from 'react-select'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'
import { PDFExportButton } from './ExportToPDF'

//Upload any missing receipts via this component in a modal
export function ReceiptModal({modalDisclosure, model}) {

    const [modalOpened, modalHandlers] = modalDisclosure
    const [attached, setAttached] = useState('')
    const [uploading, setUploading] = useState(false)

    const uploadReceipt = async () => {
        setUploading(true)
        let config = { headers: { 'content-type': 'multipart/form-data' }}
        try {
            let res = await axios.post('/receipts', {
                receiptFile: attached,
                payable_type: model.type,
                payable_id: model.id
            },config)
            SuccessNotification('Success!', res.data.message)
            modalHandlers.close()
            setAttached('')
            setUploading(false)
        } catch (err) {
            ErrorNotification(err)
            setUploading(false)
        }
    }

    return (
        <Modal opened={modalOpened} onClose={() => {modalHandlers.close(); setAttached('')}} title="No receipt found!" centered>
            <div className="mb-4">
                upload receipt
                <FileInput
                    value={attached}
                    onChange={setAttached}
                    icon={<DocumentArrowUpIcon />}
                />
            </div>
            {attached && !uploading ?
                <button className="bg-sky-600 text-white h-9 w-20 border rounded-md" onClick={() => uploadReceipt()}>Upload</button>
                : attached && uploading ?
                <Button loading={true} className="bg-sky-600">Upload</Button>
                : ''
            }
            <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={() => {modalHandlers.close(); setAttached('')}}>Cancel</button>
        </Modal>
    )
}

//The main page to view reports
export default function ViewTreasuryReport({reports, rents, treasuryItems, previousBudget, remainingBudget, calculatedRemainingBudget, start, end}) {

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
            case 'payment':
                return treasuryItems.filter(x => x.treasurable_type == "App\\Models\\Payment")
            case 'recurring':
                return treasuryItems.filter(x => x.treasurable_type == "App\\Models\\PaidRecurringPayment")
            case 'purchase':
                return treasuryItems.filter(x => x.treasurable_type == "App\\Models\\Purchase")
            case 'maintenance':
                return treasuryItems.filter(x => x.treasurable_type == "App\\Models\\Maintenance")
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

    const [modalOpened, modalHandlers] = useDisclosure(false)

    const [selectedModel, setSelectedModel] = useState({id: '', model: ''})

    useEffect(() => {
        const getReceipts = async () => {
            let arr = []
            for (let item of treasuryItems) {
                let res = await axios.get('/receipts?model=' + item.treasurable_type + '&id=' +item.treasurable_id)
                res.data.length == 1 ? arr.push(res.data[0]) : ''
            }
            setReceipts(arr)
        }
        if(!modalOpened) {
            getReceipts()
        }
    },[modalOpened])

    // for the dropdown
    const groupedOptions = [
        {
            label: 'Payment Direction',
            options: [
                {value: 'incoming', label: 'Incoming'},
                {value: 'outgoing', label: 'Outgoing'}
            ]
        },
        {
            label: 'Payment Type',
            options: [
                {value: 'rent', label: 'Rent'},
                {value: 'recurring', label: 'Recurring'},
                {value: 'purchase', label: 'Purchase'},
                {value: 'maintenance', label: 'Maintenance'},
                {value: 'payment', label: 'Other/General'},
            ]
        }
    ]

    //optional for the dropdown, not currently used
    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

    const formatGroupLabel = (data) => (
        <div style={groupStyles}>
            <span>{data.label}</span>
            <span>{data.options.length}</span>
        </div>
    )

    useEffect(() => {
        const mapTreasuryItems = async () => {
            let arr = []
            for (let item of treasuryItems) {
                let description
                item.treasurable_type == 'App\\Models\\Payment' ? description = await axios.get('/payments/'+item.treasurable_id+'?description') 
                : item.treasurable_type == 'App\\Models\\Purchase' ? description = await axios.get('/purchases/'+item.treasurable_id+'?name')
                : item.treasurable_type == 'App\\Models\\Maintenance' ? description = await axios.get('/maintenance/'+item.treasurable_id+'?name')
                : description = ''

                let sourceOrRecipient = await axios.get('/treasury-reports?find=sourceOrRecipient&type='+item.treasurable_type+'&id='+item.treasurable_id)
                arr.push({
                id: item.id,
                type: item.treasurable_type,
                sourceOrRecipient: sourceOrRecipient.data,
                description: typeof description.data == "object" ? 'There is no description' : description.data,
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
        } else if (type == 'App\\Models\\PaidRent') {
            return ''
        } else {
            return <button onClick={() => {setSelectedModel({id: id, type: type}); modalHandlers.open()}}>Upload Receipt</button>
        }
    }

    const getFriendlyName = (type) => {
        return mappedTreasuryItems.find(x => x.type == type).friendly_type
    }

    const getDescription = (id) => {
        return mappedTreasuryItems.find(x => x.id === id).description
    }

    return (
        loading ?
            <Loader color="cyan" size="xl" className="mt-40" />
            :
        <>
            <div className="flex flex-row mt-4 justify-between">
                <div className="flex flex-row mt-4">
                    <div className="bg-white text-sm md:text-xl mr-4">Report Start: {DateTimeToUKDate(start)}</div>
                    <ArrowLongRightIcon className="h-6 w-6" />
                    <div className="bg-white text-sm md:text-xl ml-4">Report End: {DateTimeToUKDate(end)}</div>
                </div>
                <PDFExportButton
                    treasuryItems={treasuryItems}
                    start={start}
                    end={end}
                    previousBudget={previousBudget}
                    remainingBudget={remainingBudget}
                    mappedTreasuryItems={mappedTreasuryItems}
                />
            </div>
            <div>Starting Balance: £{previousBudget}</div>
            <div className="w-full flex flex-col items-center">
                <div className="w-4/6">
                    <Select
                        className="w-full md:w-1/2 lg:w-1/4"
                        placeholder="Filter"
                        isClearable
                        options={groupedOptions}
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
                                <div className="flex flex-row gap-x-1">
                                    {
                                        getFriendlyName(item.treasurable_type)
                                    }
                                    { 
                                        (item.treasurable_type === 'App\\Models\\Payment' || item.treasurable_type === 'App\\Models\\Purchase' || item.treasurable_type === 'App\\Models\\Maintenance') &&
                                            <Group position="center">
                                                <HoverCard width={280} shadow="md">
                                                    <HoverCard.Target>
                                                        <button className="bg-blue-400 w-4 h-4 text-white border rounded-full">i</button>
                                                    </HoverCard.Target>
                                                    <HoverCard.Dropdown>
                                                        <Text size="sm">
                                                            {getDescription(item.id)}
                                                            {item.treasurable_type === 'App\\Models\\Purchase' ?
                                                                <>
                                                                <br />
                                                                <a target="_blank" href={`/purchases/${item.treasurable_id}`} className="text-cyan-600">View Item</a> 
                                                                </> : ''
                                                            }
                                                        </Text>
                                                    </HoverCard.Dropdown>
                                                </HoverCard>
                                            </Group>
                                    }
                                </div>
                            </TD>
                            <TD>{item.is_incoming ? 'incoming' : 'outgoing'}</TD>
                            <TD>
                                {
                                    mappedTreasuryItems.map(x => x.id == item.id ? x.sourceOrRecipient : '')
                                }
                            </TD>
                            <TD>{ReceiptDownloadLink(item.treasurable_id, item.treasurable_type)}</TD>
                        </tr>
                    ))}
                    
                </TBody>
                </Table>
            </div>

            {remainingBudget !== calculatedRemainingBudget && <div className="mt-5 text-2xl">Adjusted budget: £{remainingBudget}</div>}
            <div className={`${remainingBudget === calculatedRemainingBudget ? 'mt-5 text-2xl' : ''}`}>Calculated remaining budget: £{calculatedRemainingBudget}</div>
            <ReceiptModal modalDisclosure={[modalOpened, modalHandlers]} model={selectedModel} />
        </>
    )
}
