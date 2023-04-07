import { useEffect, useState, Fragment } from 'react'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { Button, FileInput } from '@mantine/core'

export default function ConfirmPaymentAndReceipt({id, payableHook, openHook, model, paymentStatusHook}) {

    const [attached, setAttached] = useState([])
    const [existingReceipts, setExistingReceipts] = useState([])
    const [opened, setOpened] = openHook
    const [payable, setPayable] = payableHook
    const [paymentStatus, setPaymentStatus] = paymentStatusHook ?? ''

    useEffect(() => {
        const getReceipts = async () => {
            let modelQueryParam
            model == 'purchases' ? modelQueryParam = 'App\\Models\\Purchase' : modelQueryParam = 'App\\Models\\Maintenance'
            let receipts = await axios.get('/receipts?model='+modelQueryParam+'&id='+id)
            setExistingReceipts(receipts.data)
        }
        getReceipts()
    },[])

    const updatePayable = async () => {
        if(model == 'purchases') {
            await axios.patch('/purchases/'+id, {
                price: payable.price,
                purchased: payable.purchased,
                received: payable.received
            })
            if(payable.purchased == true) {
                setPaymentStatus(0)
            }

        } else {
            await axios.patch('/maintenance/'+id, {
                final_cost: payable.final_cost,
                paid: payable.paid,
                additional_details: payable.additional_details
            })

        }
        if(attached){
            let config = { headers: { 'content-type': 'multipart/form-data' }}
            attached.forEach(async attachment => (
                await axios.post('/receipts', {
                    receiptFile: attachment,
                    payable_type: model == 'purchases' ? "App\\Models\\Purchase" : "App\\Models\\Maintenance",
                    payable_id: id
                },config
            )))
        }
        setOpened(false)
    }

    const deleteReceipt = (id) => {
        axios.delete('/receipts/'+id)
        setExistingReceipts(existingReceipts.filter(x => x.id !== id))
    }

    return (
        <div>
            {
                model == 'purchases' && paymentStatus == '0' ?
                    <>
                        <span>Confirm Payment amount:</span>
                        <div className="flex flex-row">
                            <span className="text-xl mt-2 mr-2">£</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price"
                                defaultValue={payable.price}
                                onChange={(e) => {
                                    e.target.value == '' ? setPayable({...payable, price: ''}) : setPayable({...payable, price: parseFloat(e.target.value).toFixed(2)});
                                }}
                            />
                        </div>
                    </>
                : ''
            }

            {model == 'maintenance' &&
                <>
                    <span>Confirm final cost:</span>
                    <div className="flex flex-row">
                        <span className="text-xl mt-2 mr-2">£</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Final Cost"
                            defaultValue={payable.final_cost}
                            onChange={(e) => {
                                e.target.value == '' ? setPayable({...payable, final_cost: ''}) : setPayable({...payable, final_cost: parseFloat(e.target.value).toFixed(2)});
                            }}
                        />
                    </div>
                </>
            }

            <div className="mt-4">
                {existingReceipts.length > 0 &&
                    existingReceipts.map((receipt, i) => (
                        <Fragment key={receipt.id}>
                            <a href={`/receipts/${receipt.id}`}>Download Receipt {existingReceipts.length > 1 ? i+1 : ''}</a> 
                            <button 
                                onClick={(e) => deleteReceipt(receipt.id)}
                                className="text-red-600 ml-2"
                            >
                                X
                            </button>
                            <br />
                        </Fragment>
                    ))
                }
            </div>

            <div className="mt-4">
                Attach new receipts:
                <FileInput 
                    multiple 
                    value={attached} 
                    onChange={setAttached} 
                    icon={<DocumentArrowUpIcon />}
                />
            </div>

            {model == 'maintenance' &&
                <>
                    <div className="mt-4">
                        Add any additional details:
                        <textarea
                            className="w-full"
                            onChange={
                                (e) => setPayable({...payable, additional_details: e.target.value})
                            }
                            defaultValue={payable.additional_details}
                        >
                        </textarea>
                    </div>
                </>
            }

            <div className="mt-4">
                <div className="flex flex-row">
                    Payment has been made

                    {model == 'purchases' && paymentStatus == '1' ? '' :
                    <input 
                        type="checkbox"
                        className="ml-2"
                        onChange={(e) => {
                            model == 'purchases' ? 
                                setPayable({...payable, purchased: e.target.checked}) 
                            : 
                                setPayable({...payable, paid: e.target.checked}) 
                        }}
                        checked={payable.purchased == '1' || payable.paid == '1' ? true : false}
                    />}
                </div>

                {model == 'purchases' &&
                    <div className="flex flex-row">
                        This has been received
                        <input 
                            type="checkbox"
                            className="ml-2"
                            onChange={(e) => {
                                setPayable({...payable, received: e.target.checked})
                            }}
                            checked={payable.received == '1' ? true : false}
                        />
                    </div>
                }
            </div>

            <Button 
                className="bg-blue-500"
                onClick={updatePayable}
            >
                Save
            </Button>
        </div>
    )
}
