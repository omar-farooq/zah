import { useState } from 'react'
import ApprovalButtons from '@/Components/ApprovalButtons'

export default function RoleNomination({authUser, nominee, role, nominationId, userInitialApproval}) {

    const [authUserApproval, setAuthUserApproval] = useState({approval: userInitialApproval?.approval, id: userInitialApproval?.id})
    const model = {name: "App\\Models\\RoleAssignment", id: nominationId}

    return (
        <>
            <p>{nominee} for {role}</p>
            <ApprovalButtons approvalHook={[authUserApproval, setAuthUserApproval]} model={model} />
        </>
    )
}
