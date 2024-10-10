import { useState, useEffect } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import { Link } from '@inertiajs/react'
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

    return (
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
                        requesterIsViewing && <Link href={"/purchase-requests/"+requestItem.id+"/edit"}>Click here to edit this</Link>
                    }
                    <Comments model={model} />
                </FormTile>
            </TileContainer>
               
        </RequestLayout>
   )
}
