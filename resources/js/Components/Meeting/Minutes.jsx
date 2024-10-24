import { ComponentTitle, Form } from '@/Components/Meeting'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useReducer } from 'react'
import { useForm } from '@inertiajs/react'
import { useDisclosure } from '@mantine/hooks'
import { Button, Textarea } from '@mantine/core'
import ConfirmModal from '@/Components/ConfirmModal'

export default function Minutes({meetingID}) {

    //selected minute for editing or deleting
    const [selectedMinute, setSelectedMinute] = useState('')

    //Modal state
    const [modalOpened, modalHandlers] = useDisclosure(false)

    const initialState = []

    function reducer(reactiveMinutes, action) {
        switch (action.type) {
            case 'initialFetch':
                return action.fetched
            case 'add':
                //add a failsafe to prevent the possibility of duplicates.
                if(!reactiveMinutes.find(x => x.id == action.id)) {
                    return [...reactiveMinutes, {id: action.id, minute_text: action.text}]
                } else {
                    return reactiveMinutes
                }
            case 'edit':
                let foundMinuteForEditing = reactiveMinutes.find(x => x.id == action.itemId)
                setSelectedMinute({...foundMinuteForEditing, action: 'edit'})
                return reactiveMinutes.filter(x => x.id != action.itemId)
            case 'selectToDelete':
                let foundMinute = reactiveMinutes.find(x => x.id == action.itemId)
                setSelectedMinute({...foundMinute, action: 'delete'})
                modalHandlers.open()
                return reactiveMinutes
            case 'delete':
                setSelectedMinute('')
                return reactiveMinutes.filter(x => x.id != action.itemId)
            default:
                throw new Error();
        }
    }

	const [reactiveMinutes, dispatch] = useReducer(reducer, initialState);

    //minutes text box
    const [inputValue, setInputValue] = useState('')

    //When user hits the submit button for new minute
    async function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }

        axios.post('/minutes', {minute_text: inputValue, meeting_id: meetingID});
        setInputValue('')
    }

    async function handleEdit(e) {
        e.preventDefault()
        if(selectedMinute.minute_text.length < 3) {
            return
        }

        await axios.patch('/minutes/'+selectedMinute.id, selectedMinute)
        setSelectedMinute('')
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Get the minutes
    async function GetMinutes() { 
        let res = await axios.get('/minutes?meeting_id=' + meetingID)
		dispatch({type: 'initialFetch', fetched: res.data.minutes})		
    }

    useEffect(() => {
        //Receive the current minutes via an api call
        GetMinutes()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.MinuteCreated', (e) => {
                dispatch({type: 'add', id: e.model.id, text: e.model.minute_text})
            })
            .listen('.MinuteUpdated', (e) => {
                GetMinutes()
            })
            .listen('.MinuteDeleted', (e) => {
                dispatch({type: 'delete', itemId: e.model.id})
            })
        return () => {
            Echo.private(`meeting`).stopListening('.MinuteCreated').stopListening('.MinuteUpdated').stopListening('.MinuteDeleted')
            Echo.leaveChannel('meeting')
        }
    }, [])
    //Handle the delete button being clicked
    function deleteMinute(itemId) {
        axios.delete('/minutes/' + itemId)
    }

    return (
        <>
            <ComponentTitle bg="bg-emerald-700">
                Meeting Notes
            </ComponentTitle>
            <ul className="col-start-1 col-end-9">
                {
                    reactiveMinutes.length == 0 ?
                    <div className="text-2xl mb-4">There are no notes yet</div>
                    :
                    reactiveMinutes.map(minute =>
                        <li key={minute.id} className='bg-white flex justify-between border m-1 bg-white border-sky-700 text-slate-700'>
                            <div className="ml-2 whitespace-pre-line">{minute.minute_text}</div> 
                            <div className="flex flex-row">
                                {!selectedMinute &&
                                    <>
                                <div><TrashIcon className="w-6 h-6 cursor-pointer" onClick={() => dispatch({type: 'selectToDelete', itemId: minute.id})} /></div>
                                <div><PencilSquareIcon className="w-6 h-6 cursor-pointer mr-2" onClick={() => dispatch({type: 'edit', itemId: minute.id})} /></div>
                                    </>
                                }
                            </div>
                        </li>
                    )
                }
            </ul>

            {
                selectedMinute.action == 'edit' ?
                    <form onSubmit={handleEdit} className="col-start-1 col-end-9 flex flex-col items-center">
                        <Textarea 
                            defaultValue={selectedMinute.minute_text}
                            value={selectedMinute.minute_text} 
                            required={true} 
                            onChange={(e) => setSelectedMinute({...selectedMinute, minute_text: e.target.value})} 
                            minRows={4}
                            autosize
                            className="w-3/4 mt-1"
                            classNames={{ input: 'bg-gray-100'}}
                        />
                        <div className="w-full flex flex-row justify-center">
                            <Button color="dark" type="submit" className="bg-black w-1/2 md:w-1/3 lg:w-1/6 mt-4 mr-2">Edit Minute</Button>
                            <Button color="dark" className="bg-black w-1/2 md:w-1/3 lg:w-1/6 mt-4" onClick={() => {setSelectedMinute(''); GetMinutes()}}>Cancel</Button>
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
                        <Button color="dark" type="submit" className="bg-black w-1/2 md:w-1/3 lg:w-1/4 mt-4 top-4">Add Minute</Button>
                    </form>
            }
            <ConfirmModal 
                text={<p>Are you sure you want to delete this minute?<br /> "{selectedMinute.minute_text}"</p>}
                confirmFunction={() => {deleteMinute(selectedMinute.id); modalHandlers.close()}}
                cancelFunction={() => {setSelectedMinute(''); modalHandlers.close()}}
                modalOpened={modalOpened}
            />
        </>

    )
}
