import { useState, useEffect } from 'react'
import { FormTile, FlexAlignLeft, PreviewImageContainer, PreviewTile, RequestLayout, RequestName, Source, TileContainer, Title } from '@/Layouts/RequestLayout'
import { CardTile } from '@/Components/Requests'
import { DateTimeToUKLocale } from '@/Shared/Functions'
import Approval from '@/Components/Approval'
import Comments from '@/Components/Comments'

export default function MaintenanceRequest(props) {

    //variables
    const requestService = props.maintenanceRequest
    const model = {name: "App\\Models\\MaintenanceRequest", id: requestService.id}
    let verified = false
    let requesterIsViewing = false
    let authUserApprovalObject = ""

    if(props.auth.user) 
    {
        verified = props.auth.user.membership.start_date != null && props.auth.user.membership.end_date == null
        requesterIsViewing = props.auth.user.id === requestService.user.id

        if(requestService.approvals.filter(x => x.user_id === props.auth.user.id).length > 0) {
            authUserApprovalObject = requestService.approvals.filter(x => x.user_id === props.auth.user.id)[0]
        }

    }

    //hooks
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)
    const [approvalStatus, setApprovalStatus] = useState(requestService.approval_status)

    return (
        <RequestLayout>
            <Title>Maintenance Request</Title>
            <TileContainer>
                <CardTile>
                    <FlexAlignLeft>
                        <div className={`${approvalStatus == 'Chair to decide' && props.auth.user.role.name == 'Chair' ? '' : 'flex'} content-between min-w-full`}>
                            <RequestName name={requestService.required_maintenance} />
                                <div className="ml-auto mt-2 flex flex-row space-x-1">
                                    <Approval 
                                        authUserApprovalHook={[authUserApproval, setAuthUserApproval]} 
                                        approvalStatusHook={[approvalStatus, setApprovalStatus]}
                                        model={model} 
                                        verified={verified}
                                        isChair={props.auth.user.role.name == 'Chair'}
                                        isEmergency={props.maintenanceRequest.emergency == 1 ? true : false}
                                    />
                                </div>
                        </div>

                        <p className="text-xl font-semibold leading-none text-gray-600 dark:text-white">{"£" + requestService.cost }</p> 
                    </FlexAlignLeft>

                    <FlexAlignLeft>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50 mt-4"><b>Type:</b> {requestService.type}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Dates</b>: {
                            DateTimeToUKLocale(requestService.start_date).split(',')[0]}
                        {requestService.end_date != requestService.start_date
                            ? " - " + DateTimeToUKLocale(requestService.end_date).split(',')[0]
                            : ''
                        }
                        </p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Maintenance Start</b>: {requestService.start_time.split(':')[0]}:{requestService.start_time.split(':')[1]}</p>
                        <p className="text-l md:text-xl leading-normal text-gray-800 dark:text-gray-50"><b>Maintenance Finish</b>: {requestService.finish_time ? requestService.finish_time.split(':')[0]+':'+requestService.finish_time.split(':')[1] : 'Finish time not specified'}</p>
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
