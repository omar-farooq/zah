import { useState, useEffect } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import { Link } from '@inertiajs/react'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import PreviewImage from '@/Components/PreviewImage'
import Approval from '@/Components/Approval'
import Comments from '@/Components/Comments'

export default function PurchaseRequest(props) {

    //variables
    const requestItem = props.purchaseRequest
    const requestImageUrl = props.requestImage
    const model = {name: "App\\Models\\PurchaseRequest", id: requestItem.id}
    let verified = false
    let requesterIsViewing = false
    let authUserApprovalObject = ""

    if(props.auth.user) 
    {
        verified = props.auth.user.membership.start_date != null && props.auth.user.membership.end_date == null
        requesterIsViewing = props.auth.user.id === requestItem.user.id

        if(requestItem.approvals.filter(x => x.user_id === props.auth.user.id).length > 0) {
            authUserApprovalObject = requestItem.approvals.filter(x => x.user_id === props.auth.user.id)[0]
        }

    }

    //hooks
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)
    const [approvalStatus, setApprovalStatus] = useState(requestItem.approval_status)
    const [modalOpened, modalHandlers] = useDisclosure(false)

    return (
        <>
        <RequestLayout>
            <Title>Purchase Request</Title>
            <TileContainer>
                <PreviewTile>
                    <FlexAlignLeft>
                        <div className={`${approvalStatus == 'Chair to decide' && props.auth.user.role?.name == 'Chair' ? '' : 'flex'} content-between min-w-full`}>
                            <RequestName name={requestItem.name} />
                                <div className="ml-auto mt-2 flex flex-row space-x-1">
                                    <Approval 
                                        authUserApprovalHook={[authUserApproval, setAuthUserApproval]} 
                                        approvalStatusHook={[approvalStatus, setApprovalStatus]}
                                        model={model} 
                                        verified={verified} 
                                        isChair={props.auth.user.role?.name == 'Chair'}
                                    />
                                </div>
                        </div>

                        <p className="text-xl font-semibold leading-none text-gray-600 dark:text-white">{"£" + requestItem.price }{requestItem.deliveryCost == '' ? '' : <span className="text-sm"> with £{ requestItem.delivery_cost ?? '0' }  delivery fee</span>}</p> 
                    </FlexAlignLeft>

                    <PreviewImageContainer>
                        {
                            requestItem.image ?
                                <PreviewImage
                                    src={requestImageUrl} 
                                />
                            :
                                <img src="/images/No_Image_Available.jpg" />
                        }
                    </PreviewImageContainer>

                    <FlexAlignLeft>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{requestItem.description}</p>
                        <Source link={requestItem.url} />
                    </FlexAlignLeft>
                </PreviewTile>

                <FormTile>
                    {requesterIsViewing ? "You" : requestItem.user.name} requested this <i>"{requestItem.reason}" </i>
                    {
                        requesterIsViewing && 
                        <>
                            <div className="flex flex-col text-center space-y-2 mt-2">
                                <Link className="text-amber-600 text-xl" href={"/purchase-requests/"+requestItem.id+"/edit"}>edit this request</Link>
                                <button className="text-red-600 text-xl" onClick={() => {modalHandlers.open()}}>delete this request</button>
                            </div>
                        </>
                    }
                    <Comments model={model} />
                </FormTile>
            </TileContainer>
               
        </RequestLayout>

       <Modal opened={modalOpened} onClose={modalHandlers.close} title="Confirm Delete" centered>
           <div className="mb-4">Are you sure you want to delete this purchase request?</div>
           <Link
               href={route('purchase-requests.destroy', props.purchaseRequest.id)}
               method="delete" as="button"
               onClick={(e) => {modalHandlers.close()}}
               className="bg-red-600 hover:bg-red-700 text-white h-9 w-20 border rounded-md mr-0.5"
           >
               Confirm
           </Link>
           <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={modalHandlers.close}>Cancel</button>
        </Modal> 
        </>
   )
}
