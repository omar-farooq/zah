import { useEffect, useState } from 'react'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { Button, FileInput } from '@mantine/core'

export default function ConfirmPaymentAndReceipt({id, payableHook, openHook, model}) {

    const [attached, setAttached] = useState([])
    const [opened, setOpened] = openHook
    const [payable, setPayable] = payableHook

    const updatePayable = async () => {
        if(model == 'purchases') {
            await axios.patch('/purchases/'+id, {
                price: payable.price,
                purchased: payable.purchased,
                received: payable.received
            })
        } else {
            await axios.patch('/maintenance/'+id, {
                final_cost: payable.final_cost,
                paid: payable.paid,
                additional_details: payable.additional_details
            })
        }
        setOpened(false)
    }

    return (
        <div>
            {model == 'purchases' &&
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
            }

            <div className="mt-4">
                Attach Receipts:
                <FileInput 
                    multiple 
                    value={attached} 
                    onChange={setAttached} 
                    icon={<DocumentArrowUpIcon />}
                />
            </div>

            <div className="mt-4">
                <div className="flex flex-row">
                    Payment has been made
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
                    />
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
