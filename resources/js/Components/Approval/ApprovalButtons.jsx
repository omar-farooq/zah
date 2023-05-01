import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import { HandThumbDownIcon as HandThumbDownIconEmpty, HandThumbUpIcon as HandThumbUpIconEmpty } from '@heroicons/react/24/outline'

export default function ApprovalButtons({model, authUserApprovalHook, buttonType='icon'}) {

    //hook from the parent
    //Note that this must be the whole object for the auth user from the model's relationship array
    const [authUserApproval, setAuthUserApproval] = authUserApprovalHook

    //handle when the thumbs up is clicked
    const handleApproval = () => {
        authUserApproval?.approval == 'approved' ? updateApproval('removed') 
        : authUserApproval?.approval == 'rejected' || authUserApproval?.approval == 'removed' ? updateApproval('approved')
        : createApproval('approved')
    }

    //handle when the thumbs down is clicked
    const handleRejection = () => {
        authUserApproval?.approval == 'rejected' ? updateApproval('removed') 
        : authUserApproval?.approval == 'approved' || authUserApproval?.approval == 'removed' ? updateApproval('rejected')
        : createApproval('rejected')
    }

    //create an entry in the database and update the state
    async function createApproval (approval) {
        let res = await axios.post('/approval', {approvable_type: model.name, approvable_id: model.id, approval: approval})
        setAuthUserApproval({id: res.data.id, approval: approval})
    }

    //update the entry in the database and update the state
    async function updateApproval(approval) {
        await axios.patch('/approval/' + authUserApproval?.id, {approval: approval}) 
        setAuthUserApproval(approvalObj => ({...approvalObj, approval: approval}))
    }

    return (
        <>
            {authUserApproval?.approval == 'approved' 
                ? 
                    buttonType == 'icon' ? 
                        <HandThumbUpIcon className="h-6 w-6 text-green-500 cursor-pointer" onClick={handleApproval} /> 
                    :
                        <button className="text-green-500 cursor-pointer" onClick={handleApproval}>Approved</button>
                :
                    buttonType == 'icon' ?
                        <HandThumbUpIconEmpty className="h-6 w-6 cursor-pointer" onClick={handleApproval} />
                    :
                        <button className="cursor-pointer" onClick={handleApproval}>Approve</button>
            }

            {authUserApproval?.approval == 'rejected' 
                    ? 
                        buttonType == 'icon' ?
                            <HandThumbDownIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={handleRejection} /> 
                        :
                            <button className="text-red-500 cursor-pointer" onClick={handleRejection}>Rejected</button>
                    :
                        buttonType == 'icon' ?
                            <HandThumbDownIconEmpty className="h-6 w-6 cursor-pointer"  onClick={handleRejection} />
                        :
                            <button className="cursor-pointer" onClick={handleRejection}>Reject</button>
            }
        </>
    )
}
