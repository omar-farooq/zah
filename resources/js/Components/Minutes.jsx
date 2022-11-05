import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import TextArea from '@/Components/TextArea'

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
            <ul>
                {reactiveMinutes.map(minute =>
                    <li key={minute.id}>
                        {minute.minute_text} <button onClick={() => deleteMinute(minute.id)}>X</button>
                    </li>
                )}
            </ul>

            <form onSubmit={handleSubmit}>
                <TextArea type="text" value={inputValue} required={true} handleChange={handleChange}> </TextArea>
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}
