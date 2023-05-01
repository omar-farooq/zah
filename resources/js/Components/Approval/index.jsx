import { useEffect, useState } from 'react'
import ApprovalButtons from './ApprovalButtons'
import ChairApproval from './ChairApproval'

export default function Approval({model, authUserApprovalHook, approvalStatusHook, verified, isChair, isEmergency=false, buttonType='icon'}) {
    const [memberApprovalCount, setMemberApprovalCount] = useState('')
    const [authUserApproval, setAuthUserApproval] = authUserApprovalHook
    const [approvalStatus, setApprovalStatus] = approvalStatusHook
    const [memberCount, setMemberCount] = useState('')

    const updateModelApprovalStatus = async (approval) => {
        let newStatus = await axios.patch('/update-approval-status', {
            model: model.name,
            id: model.id,
            approval: approval 
        })

        setApprovalStatus(newStatus.data)
    }

    useEffect(() => {
        const getMemberCount = async () => {
            let count = await axios.get('/users?memberCount=true')
            setMemberCount (count.data)
        }
        getMemberCount()
    },[])

    useEffect(() => {
        const getApprovalCount = async () => {
            let count = await axios.get('/approval?model='+model.name+'&id='+model.id)
            setMemberApprovalCount(count.data)
        }
        getApprovalCount()
    },[authUserApproval])

    useEffect(() => {
        if(isEmergency && approvalStatus == 'in voting' && memberApprovalCount.approved > 0) {
            updateModelApprovalStatus('approved')
        } else if(memberCount && approvalStatus == 'in voting' && memberApprovalCount.approved > (memberCount / 2)) {
            updateModelApprovalStatus('approved')
        } else if(memberCount && approvalStatus == 'in voting' && memberApprovalCount.rejected > (memberCount / 2)) {
            updateModelApprovalStatus('rejected')
        } else if(memberCount && approvalStatus == 'in voting' && memberApprovalCount.approved == (memberCount / 2) && memberApprovalCount.rejected == (memberCount / 2)) {
            updateModelApprovalStatus('Chair to decide')
        } else {

        }
    },[memberApprovalCount])

    return (
        approvalStatus == 'in voting' ?
            verified ?
            <ApprovalButtons
                authUserApprovalHook={[authUserApproval, setAuthUserApproval]}
                model={model}
                buttonType={buttonType}
            />
            : <span>only members can vote</span>
        : approvalStatus == 'Chair to decide' && isChair ?
            <ChairApproval 
                model={model}
                approvalStatusHook={[approvalStatus, setApprovalStatus]}
            />

        : <div className={`text-xl font-bold ${approvalStatus == 'rejected' ? 'text-red-600' : approvalStatus == 'approved' ? 'text-green-600' : 'text-amber-600'}`}>{approvalStatus}</div>
        
    )
}
