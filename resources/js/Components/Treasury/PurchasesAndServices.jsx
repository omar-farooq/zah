import { Fragment, useState, useEffect, useReducer } from 'react'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

export default function PurchasesAndServices({unreported, itemReducer, reducerFunction}) {

    const [items, dispatch] = itemReducer

    useEffect(() => {
        const mapItems = () => {
            unreported.forEach(async (x) => {
                let res = await axios.get('/treasurable/'+x.id)
                dispatch({
                    type: 'map',  
                    id: x.id,
                    name: res.data.maintenance_request?.required_maintenance ?? res.data.name,
                    price: res.data.final_cost ?? res.data.price,
                    modelId: res.data.id                    
                })
            })
        }
        mapItems()
    },[])

    console.log(items)
    return (
        <>
            <div className="text-xl mt-12 font-bold">Purchases and Services</div>
            <SmallTable>
                <THead>
                    <FirstTH heading="Purchase or Service" />
                    <TH heading="Amount" />
                    <LastTH />
                </THead>
                <TBody>
                    {items.map(x => (
                        <Fragment key={x.id}>
                            <tr>
                                <FirstTD data={x.name} />
                                <TD>£{x.price} </TD>
                                <LastTD>view link goes here</LastTD>
                            </tr>
                        </Fragment>
                    ))}
                </TBody>
            </SmallTable>
        </>
    )
}
