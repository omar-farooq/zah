import { Fragment, useState, useEffect, useReducer } from 'react'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function PurchasesAndServices({unreported, itemReducer, reducerFunction, calculatedHook}) {

    const [items, dispatch] = itemReducer

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

    return (
        <>
            <div className="text-xl mt-12 font-bold">Purchases and Services</div>
            <SmallTable>
                <THead>
                    <FirstTH heading="Purchase or Service" />
                    <TH heading="Amount" />
                    <TH heading="Receipt" />
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
                                <LastTD>view link goes here</LastTD>
                            </tr>
                        </Fragment>
                    ))}
                </TBody>
            </SmallTable>
        </>
    )
}
