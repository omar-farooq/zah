import { Button, Textarea } from '@mantine/core'
import { ComponentTitle } from '@/Components/Meeting'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useReducer } from 'react'
import Input from '@/Components/Input'

export default function Agenda({auth, meetingId}) {

    const initialState = []

    function reducer(reactiveAgenda, action) {
        switch (action.type) {
            case 'initialFetch':
                return action.fetched.sort((a,b) => a.user_id - b.user_id)
            case 'add':
                //add a failsafe to prevent the possibility of duplicates.
                if(!reactiveAgenda.find(x => x.id == action.id)) {
                    //don't sort and instead return the latest one after the rest for visibility
                    //return [...reactiveAgenda, {id: action.id, item: action.item, user_id: action.user_id}].sort((a,b) =>a.user_id - b.user_id)
                    return [...reactiveAgenda, {id: action.id, item: action.item, user_id: action.user_id}]
                } else {
                    //return reactiveAgenda.sort((a,b) =>a.user_id - b.user_id)
                    return reactiveAgenda
                }
            case 'delete':
                return reactiveAgenda.filter(x => x.id != action.itemId)
            default:
                throw new Error();
        }
    }

    const [reactiveAgenda, dispatch] = useReducer(reducer, initialState);
    
    //members
    const [users, setUsers] = useState('')

    //agenda form input
    const [inputValue, setInputValue] = useState('')

    //When user hits the submit button for new agenda
    function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }
        axios.post('/agenda', {item: inputValue, meeting_id: meetingId});
        setInputValue('')
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Receive the current agenda items via an api call
    useEffect(() => {
		async function getAgendaItems() { 
            let fetchedUsers = await axios.get('/users?filter=none')
            await setUsers(fetchedUsers.data)
            let res
            meetingId ?
			    res = await axios.get('/agenda?meeting_id='+meetingId)
            :
			    res = await axios.get('/agenda')
            dispatch({type: 'initialFetch', fetched: res.data.agenda})
		}
        getAgendaItems()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.MeetingAgendaCreated', (e) => {
                dispatch({type: 'add', id: e.model.id, item: e.model.item, user_id: e.model.user_id})
            })
            .listen('.MeetingAgendaDeleted', (e) => {
                dispatch({type: 'delete', itemId: e.model.id})
            })
        return () => {
            Echo.private(`meeting`).stopListening('.MeetingAgendaCreated').stopListening('.MeetingAgendaDeleted')
            Echo.leaveChannel('meeting')
        }
    },[])

    //Handle the delete button being clicked
    function deleteAgendaItem(itemId) {
        axios.delete('/agenda/' + itemId)
    }

    return (
        <>
            <ComponentTitle bg="bg-rose-700">Agenda</ComponentTitle>
            <ul className="col-start-1 col-end-9">
                {
                    reactiveAgenda.length === 0 ? <div className="text-2xl">No agenda has been set</div> :
                    reactiveAgenda.map((agenda,i) =>
                        <li key={agenda.id} className={`${i % 2 == 0 ? 'border-black bg-white' : 'border-black bg-zinc-100'} text-black flex justify-between items-center m-1 border`}>
                            <div className="ml-2 whitespace-pre-line">
                                <span className="text-sm">{users?.find(x => x.id === agenda.user_id).name}:</span>
                                <br />
                                {agenda.item} 
                            </div> 
                            <div className={`${auth.user.id === agenda.user_id ? '' : 'hidden'}`}>
                                <TrashIcon className="w-5 h-5 cursor-pointer mr-2" onClick={() => deleteAgendaItem(agenda.id)} />
                            </div>
                        </li>
                    )
                }
            </ul>

            <form onSubmit={handleSubmit} className="col-start-1 col-end-9 flex flex-col items-center">
                <Textarea
                    value={inputValue}
                    onChange={handleChange}
                    autosize
                    minRows={4}
                    required={true}
                    className="w-3/4 mt-6"
                    classNames={{ input: 'bg-zinc-100'}}
                />
                <Button color="dark" type="submit" className="bg-black w-1/2 md:w-1/3 lg:w-1/4 mt-4 top-4">Add Agenda Item </Button>
            </form>
        </>
    )
}
