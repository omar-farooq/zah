import { useState } from 'react'
import Approval from '@/Components/Approval'

export default function PendingApproval({auth, rule}) {

    let verified = false
    let authUserApprovalObject = ""
    if(auth.user) {
        verified = auth.user.membership.start_date != null && auth.user.membership.end_date == null

        if(rule.approvals.filter(x => x.user_id === auth.user.id).length > 0) {
            authUserApprovalObject = rule.approvals.filter(x => x.user_id === auth.user.id)[0]
        }
    }

    const [approvalStatus, setApprovalStatus] = useState(rule.approval_status)
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)

    const model = {name: "App\\Models\\Rule", id: rule.id}
    
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row space-x-2">
                    <div>{rule.rule_number}</div>
                    <div>{rule.rule}</div>
                </div>
                <div className="space-x-3 mr-3 min-w-fit">
                    <Approval
                        authUserApprovalHook={[authUserApproval, setAuthUserApproval]}
                        approvalStatusHook={[approvalStatus, setApprovalStatus]}
                        model={model}
                        verified={verified}
                        isChair={auth.user.role?.name == 'Chair'}
                        buttonType='text'
                    />
                </div>
            </div>
        </>
    )
}
