import { ComponentTitle, Form } from '@/Components/Meeting'
import { useState, useEffect, useReducer } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { Button, Textarea } from '@mantine/core'

export default function Minutes({meetingID}) {

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
            case 'delete':
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

    const handleChange = () => {
        setInputValue(event.target.value)
    }


    //Receive the current minutes via an api call
    useEffect(() => {
        async function GetMinutes() { 
            let res = await axios.get('/minutes?meeting_id=' + meetingID)
			dispatch({type: 'initialFetch', fetched: res.data.minutes})		
        }
        GetMinutes()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.MinuteCreated', (e) => {
                dispatch({type: 'add', id: e.model.id, text: e.model.minute_text})
            })
            .listen('.MinuteDeleted', (e) => {
                dispatch({type: 'delete', itemId: e.model.id})
            })
        return function cleanup() {
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
                Minutes
            </ComponentTitle>
            <ul className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-7">
                {reactiveMinutes.map(minute =>
                    <li key={minute.id} className='bg-white flex justify-between border m-1 bg-white border-sky-700 text-slate-700'>
                        <div className="ml-2 whitespace-pre-line">{minute.minute_text}</div> 
                        <button onClick={() => deleteMinute(minute.id)}>X</button>
                    </li>
                )}
            </ul>

            <form onSubmit={handleSubmit} className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-7 flex flex-col items-center">
                <Textarea 
                    value={inputValue} 
                    required={true} 
                    onChange={handleChange} 
                    minRows={4}
                    autosize
                    className="w-3/4 mt-1"
                    classNames={{ input: 'bg-gray-100 border-black'}}
                />
                <Button color="dark" type="submit" className="bg-black w-1/3 lg:w-1/4 mt-4">Add Minute</Button>
            </form>
        </>
    )
}
