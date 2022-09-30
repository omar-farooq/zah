import { useState } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import ApprovalButtons from '@/Components/ApprovalButtons'
import CommentBox from '@/Components/CommentBox'
import CommentDisplay from '@/Components/CommentDisplay'

export default function PurchaseRequest(props) {

    //variables
    const requestItem = props.purchaseRequest
    const model = {name: "App\\Models\\PurchaseRequest", id: requestItem.id}
    let verified = false
    let requesterIsViewing = false
    let authUser = ''
    let authUserApprovalObject = ""

    if(props.auth) 
    {
        authUser = props.auth.user
        verified = authUser.membership.start_date != null && authUser.membership.end_date == null
        requesterIsViewing = authUser.id === requestItem.user.id

        if(requestItem.approvals.filter(x => x.user_id === authUser.id).length > 0) {
            authUserApprovalObject = requestItem.approvals.filter(x => x.user_id === authUser.id)[0]
        }

    }

    //hooks
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)
    const [comments, setComments] = useState(props.comments.data)

    console.log(props)
    return (
        <RequestLayout>
            <Title>Purchase Request</Title>
            <TileContainer>
                <PreviewTile>
                    <FlexAlignLeft>
                        <div className="flex content-between min-w-full">
                            <RequestName name={requestItem.name} />
                                <div className="ml-auto mt-2">
                                    {
                                        verified ?
                                        <ApprovalButtons approvalHook={[authUserApproval, setAuthUserApproval]} model={model} />
                                        : <span>only members can vote</span>
                                    }
                                </div>
                        </div>

                        <p className="text-xl font-semibold leading-none text-gray-600 dark:text-white">{"£" + requestItem.price }{requestItem.deliveryCost == '' ? '' : <span className="text-sm"> with £{ requestItem.delivery_cost }  delivery fee</span>}</p> 
                    </FlexAlignLeft>

                    <PreviewImageContainer>
                        <img src={"/images/" + requestItem.image} />
                    </PreviewImageContainer>

                    <FlexAlignLeft>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mx-auto">{requestItem.description}</p>
                        <Source link={requestItem.url} />
                    </FlexAlignLeft>
                </PreviewTile>

                <FormTile>
                    {requesterIsViewing ? "You" : requestItem.user.name} requested this <i>"{requestItem.reason}" </i>
                    <CommentBox model={model} commentHook={[comments, setComments]} />
                    <CommentDisplay comments={comments} />
                </FormTile>
            </TileContainer>
               
        </RequestLayout>
   )
}
