import { ComponentTitle, Form } from '@/Components/Meeting'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useReducer } from 'react'
import { useForm } from '@inertiajs/react'
import { useDisclosure } from '@mantine/hooks'
import { Button, Textarea } from '@mantine/core'
import ConfirmModal from '@/Components/ConfirmModal'

export default function Decisions({meetingID}) {

    //selected Decision for editing or deleting
    const [selectedDecision, setSelectedDecision] = useState('')

    //Modal state
    const [modalOpened, modalHandlers] = useDisclosure(false)

    const initialState = []

    function reducer(reactiveDecisions, action) {
        switch (action.type) {
            case 'initialFetch':
                return action.fetched
            case 'add':
                //add a failsafe to prevent the possibility of duplicates.
                if(!reactiveDecisions.find(x => x.id == action.id)) {
                    return [...reactiveDecisions, {id: action.id, decision_text: action.text}]
                } else {
                    return reactiveDecisions
                }
            case 'edit':
                let foundDecisionForEditing = reactiveDecisions.find(x => x.id == action.itemId)
                setSelectedDecision({...foundDecisionForEditing, action: 'edit'})
                return reactiveDecisions.filter(x => x.id != action.itemId)
            case 'selectToDelete':
                let foundDecision = reactiveDecisions.find(x => x.id == action.itemId)
                setSelectedDecision({...foundDecision, action: 'delete'})
                modalHandlers.open()
                return reactiveDecisions
            case 'delete':
                setSelectedDecision('')
                return reactiveDecisions.filter(x => x.id != action.itemId)
            default:
                throw new Error();
        }
    }

	const [reactiveDecisions, dispatch] = useReducer(reducer, initialState);

    //decisions text box
    const [inputValue, setInputValue] = useState('')

    //When user hits the submit button for new decision
    async function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }

        axios.post('/decisions', {decision_text: inputValue, meeting_id: meetingID});
        setInputValue('')
    }

    async function handleEdit(e) {
        e.preventDefault()
        if(selectedDecision.decision_text.length < 3) {
            return
        }

        await axios.patch('/decisions/'+selectedDecision.id, selectedDecision)
        setSelectedDecision('')
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Get the decisions
    async function GetDecisions() { 
        let res = await axios.get('/decisions?meeting_id=' + meetingID)
		dispatch({type: 'initialFetch', fetched: res.data.decisions})		
    }

    useEffect(() => {
        //Receive the current decisions via an api call
        GetDecisions()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.DecisionCreated', (e) => {
                dispatch({type: 'add', id: e.model.id, text: e.model.decision_text})
            })
            .listen('.DecisionUpdated', (e) => {
                GetDecisions()
            })
            .listen('.DecisionDeleted', (e) => {
                dispatch({type: 'delete', itemId: e.model.id})
            })
        return () => {
            Echo.private(`meeting`).stopListening('.DecisionCreated').stopListening('.DecisionUpdated').stopListening('.DecisionDeleted')
            Echo.leaveChannel('meeting')
        }
    }, [])
    //Handle the delete button being clicked
    function deleteDecision(itemId) {
        axios.delete('/decisions/' + itemId)
    }

    return (
        <>
            <ComponentTitle bg="bg-emerald-800">
                Decisions Made
            </ComponentTitle>
            <ul className="col-start-1 col-end-9">
                {
                    reactiveDecisions.length == 0 ?
                    <div className="text-2xl mb-4">There are no notes yet</div>
                    :
                    reactiveDecisions.map(decision =>
                        <li key={decision.id} className='bg-white flex justify-between border m-1 bg-white border-sky-700 text-slate-700'>
                            <div className="ml-2 whitespace-pre-line">{decision.decision_text}</div> 
                            <div className="flex flex-row">
                                {!selectedDecision &&
                                    <>
                                <div><TrashIcon className="w-6 h-6 cursor-pointer" onClick={() => dispatch({type: 'selectToDelete', itemId: decision.id})} /></div>
                                <div><PencilSquareIcon className="w-6 h-6 cursor-pointer mr-2" onClick={() => dispatch({type: 'edit', itemId: decision.id})} /></div>
                                    </>
                                }
                            </div>
                        </li>
                    )
                }
            </ul>

            {
                selectedDecision.action == 'edit' ?
                    <form onSubmit={handleEdit} className="col-start-1 col-end-9 flex flex-col items-center">
                        <Textarea 
                            defaultValue={selectedDecision.decision_text}
                            value={selectedDecision.decision_text} 
                            required={true} 
                            onChange={(e) => setSelectedDecision({...selectedDecision, decision_text: e.target.value})} 
                            minRows={4}
                            autosize
                            className="w-3/4 mt-1"
                            classNames={{ input: 'bg-gray-100'}}
                        />
                        <div className="w-full flex flex-row justify-center">
                            <Button color="dark" type="submit" className="bg-black w-1/2 md:w-1/3 lg:w-1/6 mt-4 mr-2">Edit Decision</Button>
                            <Button color="dark" className="bg-black w-1/2 md:w-1/3 lg:w-1/6 mt-4" onClick={() => {setSelectedDecision(''); GetDecisions()}}>Cancel</Button>
                        </div>
                    </form>

                :

                    <form onSubmit={handleSubmit} className="col-start-1 col-end-9 flex flex-col items-center">
                        <Textarea 
                            value={inputValue} 
                            required={true} 
                            onChange={handleChange} 
                            minRows={4}
                            autosize
                            className="w-3/4 mt-6"
                            classNames={{ input: 'bg-gray-100'}}
                        />
                        <Button color="dark" type="submit" className="bg-black w-1/2 md:w-1/3 lg:w-1/4 mt-4 top-4">Add Decision</Button>
                    </form>
            }
            <ConfirmModal 
                text={<p>Are you sure you want to delete this decision?<br /> "{selectedDecision.decision_text}"</p>}
                confirmFunction={() => {deleteDecision(selectedDecision.id); modalHandlers.close()}}
                cancelFunction={() => {setSelectedDecision(''); modalHandlers.close()}}
                modalOpened={modalOpened}
            />
        </>

    )
}
