import { useState, useEffect } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import { CardTile } from '@/Components/Requests'
import { DateTimeToUKLocale } from '@/Shared/Functions'
import ApprovalButtons from '@/Components/ApprovalButtons'
import Comments from '@/Components/Comments'

export default function MaintenanceRequest(props) {

    //variables
    const requestService = props.maintenanceRequest
    const model = {name: "App\\Models\\MaintenanceRequest", id: requestService.id}
    let verified = false
    let requesterIsViewing = false
    let authUser = ''
    let authUserApprovalObject = ""

    if(props.auth.user) 
    {
        authUser = props.auth.user
        verified = authUser.membership.start_date != null && authUser.membership.end_date == null
        requesterIsViewing = authUser.id === requestService.user.id

        if(requestService.approvals.filter(x => x.user_id === authUser.id).length > 0) {
            authUserApprovalObject = requestService.approvals.filter(x => x.user_id === authUser.id)[0]
        }

    }

    //hooks
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)

    return (
        <RequestLayout>
            <Title>Maintenance Request</Title>
            <TileContainer>
                <CardTile>
                    <FlexAlignLeft>
                        <div className="flex content-between min-w-full">
                            <RequestName name={requestService.required_maintenance} />
                                <div className="ml-auto mt-2">
                                    {
                                        verified ?
                                        <ApprovalButtons approvalHook={[authUserApproval, setAuthUserApproval]} model={model} />
                                        : <span>only members can vote</span>
                                    }
                                </div>
                        </div>

                        <p className="text-xl font-semibold leading-none text-gray-600 dark:text-white">{"£" + requestService.cost }</p> 
                    </FlexAlignLeft>

                    <FlexAlignLeft>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mt-4"><b>Type:</b> {requestService.type}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Maintenance Start</b>: {DateTimeToUKLocale(requestService.start)}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Maintenance Finish</b>: {DateTimeToUKLocale(requestService.finish)}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Contractor:</b> {requestService.contractor}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50">Email: {requestService.contractor_email} Phone: {requestService.contractor_phone}</p>
                        {requesterIsViewing ? "You" : requestService.user.name} requested this {requestService.reason}
                    </FlexAlignLeft>
                </CardTile>

                <FormTile>
                    <Comments model={model} />
                </FormTile>
            </TileContainer>
               
        </RequestLayout>
   )
}
