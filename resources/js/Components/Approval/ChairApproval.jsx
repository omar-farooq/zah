import { Alert } from '@mantine/core'
export default function ChairApproval({approvalStatusHook, model}) {

    const [approvalStatus, setApprovalStatus] = approvalStatusHook
    const handleButtonClick = async(approval) => {
        let newStatus = await axios.patch('/update-approval-status', {
            model: model.name,
            id: model.id,
            approval: approval
        })
        setApprovalStatus(newStatus.data)
    }

    return (
        <>
            <Alert title="Chair Approval Required" color="orange" classNames={{ root: 'w-full' }}>
				Review all comments and make a fair decision<br />
                <button onClick={() => handleButtonClick('approved')} className="mr-5 text-green-600">Approve</button> 
                <button onClick={() => handleButtonClick('rejected')} className="text-red-600">Reject</button>
            </Alert>
        </>
    )
}
