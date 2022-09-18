import { useState, useEffect } from 'react'
import Input from '@/Components/Input'

export default function Agenda() {

    //agenda items
    const [reactiveAgenda, updateReactiveAgenda] = useState([])

    //agenda form input
    const [inputValue, setInputValue] = useState('')

    //When user hits the submit button for new agenda
    async function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }

        let response = await axios.post('/agenda', {item: inputValue});
        setInputValue('')
        updateReactiveAgenda([...reactiveAgenda, {id: response.data.id, item: inputValue, user_id: response.data.user_id}])
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Receive the current agenda items via an api call
    useEffect(() => {
        async function AgendaItems() { 
            let res = await axios.get('/agenda')
            updateReactiveAgenda(res.data.agenda)
        }
        AgendaItems()
    }, [])

    //Handle the delete button being clicked
    async function deleteAgendaItem(itemId) {
        await axios.delete('/agenda/' + itemId)
        updateReactiveAgenda(reactiveAgenda.filter(x => x.id != itemId))
    }

    return (
        <>
            <ul>
                {reactiveAgenda.map(agenda =>
                    <li key={agenda.id}>
                        {agenda.item} <button onClick={() => deleteAgendaItem(agenda.id)}>X</button>
                    </li>
                )}
            </ul>

            <form onSubmit={handleSubmit}>
                <Input type="text" value={inputValue} required={true} handleChange={handleChange} />
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}
