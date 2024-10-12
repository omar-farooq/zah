import { Fragment, useState, useEffect, useReducer } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Link } from '@inertiajs/react'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function PurchasesAndServices({unreported, itemReducer, purchasesTotalHook, servicesTotalHook}) {

    const [items, dispatch] = itemReducer
	const [purchasesTotal, setPurchasesTotal] = purchasesTotalHook
	const [servicesTotal, setServicesTotal] = servicesTotalHook

    useEffect(() => {
        const mapItems = () => {
            unreported.forEach(async (x) => {
                let receipt = await axios.get('/receipts?model='+x.treasurable_type+'&id='+x.treasurable_id)
                let res = await axios.get('/treasurable/'+x.id)
                dispatch({
                    type: 'map',  
                    id: x.id,
                    name: res.data.maintenance_request?.required_maintenance ?? res.data.name,
                    price: res.data.final_cost ?? res.data.price,
                    model: x.treasurable_type,
                    modelId: res.data.id,
                    receipt: receipt.data
                })
            })
        }
        mapItems()
    },[])

	useEffect(() => {
		updateTotal()
	},[items])

	const updateTotal = () => {
		setPurchasesTotal (items.length > 0 ? items.reduce((a,b) => {
			if(b.model == 'App\\Models\\Purchase') {
				return Number(a) + Number(b.price)
			} else {
				return Number(a)
			}
		},[]) : 0)

		setServicesTotal (items.length > 0 ? items.reduce((a,b) => {
			if(b.model == 'App\\Models\\Maintenance') {
				return Number(a) + Number(b.price)
			} else {
				return Number(a)
			}
		},[]) : 0)
	}

    return (
        items.length > 0 &&
        <>
            <div className="text-xl mt-12 font-bold">Purchases and Services</div>
            <SmallTable>
                <THead>
                    <FirstTH heading="Purchase or Service" />
                    <TH heading="Amount" />
                    <TH heading="Receipt" />
                    <TH heading="Remove" />
                    <LastTH />
                </THead>
                <TBody>
                    {items.map(x => (
                        <Fragment key={x.id}>
                            <tr>
                                <FirstTD data={x.name} />
                                <TD>£{x.price} </TD>
                                <TD>
                                    {
                                        ! x.receipt[0]?.id ?
                                            <input 
                                                type="file" 
                                                id="receipt" 
                                                name="receipt" 
                                                accept="image/*, .pdf" 
                                                onChange={(e) => dispatch({type: 'addReceipt', file: e.target.files[0], id: x.id})}
                                            />
                                        : <a href={`/receipts/${x.receipt[0].id}`}>View Receipt</a>
                                    }
                                </TD>
                                <TD>
                                    <TrashIcon className="w-6 h-6 cursor-pointer" onClick={() => dispatch({type: 'delete', itemId: x.id})} />
                                </TD>
                                <LastTD>
                                    <a target="_blank" href={x.model == 'App\\Models\\Maintenance' ? '/maintenance/'+x.modelId : '/purchases/'+x.modelId}>View Item</a>
                                </LastTD>
                            </tr>
                        </Fragment>
                    ))}
                </TBody>
            </SmallTable>
        </>
    )
}
