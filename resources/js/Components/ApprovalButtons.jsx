import { PrimeIcons } from 'primereact/api'

export default function ApprovalButtons({model_name, model_id, approvalHook}) {

    //hook from the parent
    //Note that this must be the whole object for the auth user from the model's relationship array
    const [authUserApproval, setAuthUserApproval] = approvalHook

    //define the class
    const thumbsUp = authUserApproval?.approval == 'approved' ? "pi-thumbs-up-fill text-green-600" : "pi-thumbs-up"
    const thumbsDown = authUserApproval?.approval == 'rejected' ? "pi-thumbs-down-fill text-red-600" : "pi-thumbs-down"

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
        let res = await axios.post('/approval', {approvable_type: model_name, approvable_id: model_id, approval: approval})
        setAuthUserApproval({id: res.data.id, approval: approval})
    }

    //update the entry in the database and update the state
    async function updateApproval(approval) {
        await axios.patch('/approval/' + authUserApproval?.id, {approval: approval}) 
        setAuthUserApproval(approvalObj => ({...approvalObj, approval: approval}))
    }

    return (
        <>
            <span className={`pi ${thumbsUp} mr-3 cursor-pointer`} onClick={handleApproval} />
            <span className={`pi ${thumbsDown} cursor-pointer`} onClick={handleRejection} />
        </>
    )
}
