import { ComponentTitle, Form } from '@/Components/Meeting'
import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { Button, Textarea } from '@mantine/core'

export default function Minutes({meetingID}) {

    //minutes listed
    const [reactiveMinutes, updateReactiveMinutes] = useState([])

    //minutes text box
    const [inputValue, setInputValue] = useState('')

    //When user hits the submit button for new minute
    async function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }

        let response = await axios.post('/minutes', {minute_text: inputValue, meeting_id: meetingID});
        setInputValue('')
        updateReactiveMinutes([...reactiveMinutes, {id: response.data.id, minute_text: inputValue}])
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Receive the current minutes via an api call
    useEffect(() => {
        async function GetMinutes() { 
            let res = await axios.get('/minutes?meeting_id=' + meetingID)
            updateReactiveMinutes(res.data.minutes)
        }
        GetMinutes()
    }, [])

    //Handle the delete button being clicked
    async function deleteMinute(itemId) {
        await axios.delete('/minutes/' + itemId)
        updateReactiveMinutes(reactiveMinutes.filter(x => x.id != itemId))
    }

    return (
        <>
            <ComponentTitle bg="bg-emerald-700">
                Minutes
            </ComponentTitle>
            <ul className="col-start-3 col-end-7">
                {reactiveMinutes.map(minute =>
                    <li key={minute.id} className='bg-white flex justify-between border m-1 bg-white border-sky-700 text-slate-700'>
                        <div className="ml-2 whitespace-pre-line">{minute.minute_text}</div> 
                        <button onClick={() => deleteMinute(minute.id)}>X</button>
                    </li>
                )}
            </ul>

            <Form onSubmit={handleSubmit} >
                <Textarea 
                    value={inputValue} 
                    required={true} 
                    onChange={handleChange} 
                    minRows={4}
                    autosize
                    className="w-3/4 mt-1"
                    classNames={{ input: 'bg-gray-100 border-black'}}
                />
                <Button color="dark" type="submit" className="bg-black w-1/4 mt-4">Add Minute</Button>
            </Form>
        </>
    )
}
