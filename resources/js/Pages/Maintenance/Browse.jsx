import { Fragment, useEffect, useState } from 'react'
import { Input, Modal, Pagination } from '@mantine/core'
import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import ConfirmPaymentAndReceipt from '@/Components/ConfirmPaymentAndReceipt'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
import ViewMaintenance from '@/Pages/Maintenance/ViewMaintenance'
export default function Browse({auth}) {

    //Array of maintenance objects
    const [paidMaintenance, setPaidMaintenance] = useState([])
    const [needAction, setNeedAction] = useState([])

    //Modal
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState({})

    //Pagination
    const [activePaidMaintenancePage, setActivePaidMaintenancePage] = useState(1)
    const [activeNeedActionPage, setActiveNeedActionPage] = useState(1)
    const [totalPaidPages, setTotalPaidPages] = useState('')
    const [totalUnpaidPages, setTotalUnpaidPages] = useState('')

    const getPaidMaintenance = async (page, search) => {
        let res = await axios.get('/maintenance?table=paid&page='+page+'&search='+search)
        setPaidMaintenance(res.data.data)
        setTotalPaidPages(res.data.last_page)
    }

    const getNeedAction = async (page) => {
        let res = await axios.get('/maintenance?table=needAction&page='+page)
        setNeedAction(res.data.data)
        setTotalUnpaidPages(res.data.last_page)
    }

    useEffect(() => {
        if(opened == false) {
            getPaidMaintenance(activePaidMaintenancePage, '')
        }
    },[opened, activePaidMaintenancePage])

    useEffect(() => {
        if(opened == false) {
            getNeedAction(activeNeedActionPage)
        }
    },[opened, activeNeedActionPage])

    return (
        <>
        <div className="w-full flex flex-col items-center">
            {needAction.length > 0 ?
                <>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Needs payment Confirmation</h2>
                    <div className="max-w-sm md:max-w-none md:w-full md:flex md:justify-center">
                        <Table>
                            <THead>
                                <FirstTH heading="Name" />
                                <TH heading="Cost" />
                                <TH heading="Type" />
                                <TH heading="Additional Details" />
                                <LastTH />
                            </THead>
                            <TBody>
                                {needAction.map(x =>
                                    <Fragment key={x.id}>
                                        <tr>
                                            <FirstTD data={x.maintenance_request.required_maintenance} />
                                            <TD data={x.final_cost} />
                                            <TD data={x.maintenance_request.type} />
                                            <TD data={x.additional_details} />
                                            <LastTD
                                                href={"maintenance"}
                                                itemID={x.id}
                                            >
                                                <PencilSquareIcon 
                                                    className="w-6 h-6 mr-2 cursor-pointer"
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
                    </div>
                    <Pagination 
                        className="mt-5 mb-10" 
                        total={totalUnpaidPages} 
                        page={activeNeedActionPage}
                        onChange={setActiveNeedActionPage}
                        withEdges 
                    />
                </>
            :''}

                <>
                    <div className="sm:w-5/6 flex mt-4">
                    <Input 
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        placeholder="search"
                        className="ml-0"
                        onChange={(e) => getPaidMaintenance(1, e.target.value)}
                    />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">Historical Maintenance</h2>
                    <div className="max-w-sm md:max-w-none md:w-full md:flex md:justify-center">
                        <Table>
                            <THead>
                                <FirstTH heading="Name" />
                                <TH heading="Cost" />
                                <TH heading="Type" />
                                <TH heading="Additional Details" />
                                <LastTH />
                            </THead>
                            <TBody>
                                {paidMaintenance.map(x =>
                                    <Fragment key={x.id}>
                                        <tr>
                                            <FirstTD data={x.maintenance_request.required_maintenance} />
                                            <TD data={x.final_cost} />
                                            <TD data={x.maintenance_request.type} />
                                            <TD data={x.additional_details} />
                                            <LastTD
                                                href={"maintenance"}
                                                itemID={x.id}
                                            />
                                        </tr>
                                    </Fragment>
                                )}
                            </TBody>
                        </Table>
                    </div>
                    <Pagination 
                        className="mt-5" 
                        total={totalPaidPages} 
                        page={activePaidMaintenancePage}
                        onChange={setActivePaidMaintenancePage}
                        withEdges 
                    />
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
