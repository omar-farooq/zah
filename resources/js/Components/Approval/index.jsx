import { useEffect, useState } from 'react'
import ApprovalButtons from './ApprovalButtons'

export default function Approval({model, authUserApprovalHook, approvalStatusHook, verified}) {
    const [memberApprovalCount, setMemberApprovalCount] = useState('')
    const [authUserApproval, setAuthUserApproval] = authUserApprovalHook
    const [approvalStatus, setApprovalStatus] = approvalStatusHook

    useEffect(() => {
        const getApprovalCount = async () => {
            let count = await axios.get('/approval?model='+model.name+'&id='+model.id)
            setMemberApprovalCount(count.data)
        }
        getApprovalCount()
    },[authUserApproval])

    let memberCount
    useEffect(() => {
        const getMemberCount = async () => {
            let count = await axios.get('/users?memberCount=true')
            memberCount = count.data
        }
        getMemberCount()
    },[])

    return (
        approvalStatus == 'in voting' ?
            verified ?
            <ApprovalButtons
                authUserApprovalHook={[authUserApproval, setAuthUserApproval]}
                model={model}
            />
            : <span>only members can vote</span>
        : <div>{approvalStatus}</div>
        
    )
}
