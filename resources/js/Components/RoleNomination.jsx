import { useState } from 'react'
import Approval from '@/Components/Approval'

export default function RoleNomination({auth, nominee, role, nomination, userInitialApproval}) {

    const [authUserApproval, setAuthUserApproval] = useState({approval: userInitialApproval?.approval, id: userInitialApproval?.id})
    const [approvalStatus, setApprovalStatus] = useState(nomination.approval_status)

    const model = {name: "App\\Models\\RoleAssignment", id: nomination.id}

    let verified = false
    let isChair = false

    if(auth.user) {
        verified = auth.user.membership.start_date != null && auth.user.membership.end_date == null
        isChair = auth.user.role?.name == 'Chair'
    }

    return (
        <>
            <div>
                <p>{nominee} for {role}</p>
                <Approval 
                    authUserApprovalHook={[authUserApproval, setAuthUserApproval]} 
                    approvalStatusHook={[approvalStatus, setApprovalStatus]}
                    model={model} 
                    verified={auth.user.membership.start_date != null && auth.user.membership}
                    isChair={auth.user.role?.name == 'Chair'}
                />
            </div>
        </>
    )
}
