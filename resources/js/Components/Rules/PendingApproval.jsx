import { useState } from 'react'
import Approval from '@/Components/Approval'

export default function PendingApproval({auth, rule, type='add'}) {

    let verified = false
    let authUserApprovalObject = ""
    if(auth.user) {
        verified = auth.user.membership.start_date != null && auth.user.membership.end_date == null

        if(type == 'add') {
            if(rule.approvals.filter(x => x.user_id === auth.user.id).length > 0) {
                authUserApprovalObject = rule.approvals.filter(x => x.user_id === auth.user.id)[0]
            }
        } else {
            if(rule.rule_change.approvals.filter(x => x.user_id === auth.user.id).length > 0) {
                authUserApprovalObject = rule.rule_change.approvals.filter(x => x.user_id === auth.user.id)[0]
            }
        }
    }

    const [approvalStatus, setApprovalStatus] = useState(type == 'change' ? rule.rule_change.approval_status : rule.approval_status)
    const [authUserApproval, setAuthUserApproval] = useState(authUserApprovalObject)

    let model
    if(type == 'change') {
        model = {name: "App\\Models\\RuleChange", id: rule.rule_change.id}
    } else {
        model = {name: "App\\Models\\Rule", id: rule.id}
    }
    
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col space-x-2">
                    <div>{rule.rule_number}</div>
                    {type == 'change' && <div className='line-through text-red-700'>{rule.rule}</div>}
                    <div>{type == 'change' ? rule.rule_change.rule : rule.rule}</div>
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
