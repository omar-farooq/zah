import { Fragment, useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import ConfirmPaymentAndReceipt from '@/Components/ConfirmPaymentAndReceipt'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
export default function Browse({auth}) {

    const [paidMaintenance, setPaidMaintenance] = useState([])
    const [needAction, setNeedAction] = useState([])
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState({})

    const getPaidMaintenance = async (page) => {
        let res = await axios.get('/maintenance?table=paid&page='+page)
        setPaidMaintenance(res.data.data)
    }

    const getNeedAction = async (page) => {
        let res = await axios.get('/maintenance?table=needAction&page='+page)
        setNeedAction(res.data.data)
    }

    useEffect(() => {
        if(opened == false) {
            getPaidMaintenance('1')
            getNeedAction('1')
        }
    },[opened])

    return (
        <>
        <div className="w-full flex flex-col items-center">
            {needAction.length > 0 ?
                <>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Needs payment Confirmation</h2>
                    <Table>
                        <THead>
                            <FirstTH heading="Name" />
                            <TH heading="Cost" />
                            <TH heading="Type" />
                            <TH heading="Details" />
                            <LastTH />
                        </THead>
                        <TBody>
                            {needAction.map(x =>
                                <Fragment key={x.id}>
                                    <tr>
                                        <FirstTD data={x.maintenance_request.required_maintenance} />
                                        <TD data={x.final_cost} />
                                        <TD data={x.maintenance_request.type} />
                                        <TD data={x.maintenance_request.additional_details} />
                                        <LastTD
                                            href={"maintenance"}
                                            itemID={x.id}
                                        >
                                            <PencilSquareIcon 
                                                className="w-6 h-6 mr-2"
                                                onClick={() => {
                                                    setOpened(!opened);
                                                    setSelected(x)
                                                }}
                                            />
                                        </LastTD>
                                    </tr>
                                </Fragment>
                            )}
                        </TBody>
                    </Table>
                </>
            :''}

                <>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Historical Maintenance</h2>
                    <Table>
                        <THead>
                            <FirstTH heading="Name" />
                            <TH heading="Cost" />
                            <TH heading="Type" />
                            <TH heading="Details" />
                            <LastTH />
                        </THead>
                        <TBody>
                            {paidMaintenance.map(x =>
                                <Fragment key={x.id}>
                                    <tr>
                                        <FirstTD data={x.maintenance_request.required_maintenance} />
                                        <TD data={x.final_cost} />
                                        <TD data={x.maintenance_request.type} />
                                        <TD data={x.maintenance_request.additional_details} />
                                        <LastTD
                                            href={"maintenance"}
                                            itemID={x.id}
                                        />
                                    </tr>
                                </Fragment>
                            )}
                        </TBody>
                    </Table>
                </>
        </div>

        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Confirm payment and other details"
        >
            <ConfirmPaymentAndReceipt
                openHook={[opened, setOpened]}
                id={selected.id}
                payableHook={[selected, setSelected]}
                model='maintenance'
            />
        </Modal>
        </>
    )
}
