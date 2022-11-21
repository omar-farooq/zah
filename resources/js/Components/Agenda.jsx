import { Button, Textarea } from '@mantine/core'
import { TrashIcon } from '@heroicons/react/24/outline'
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
            <div className="text-xl col-start-3 col-end-5 bg-rose-700 text-white flex justify-center">Agenda</div>
            <ul className="col-start-3 col-end-7">
                {reactiveAgenda.map((agenda,i) =>
                    <li key={agenda.id} className={`${i % 2 == 0 ? 'border-black' : 'border-black'} bg-white text-black flex justify-between items-center m-1 border`}>
                        <div className="ml-2 whitespace-pre-line">{agenda.item}</div> 
                        <div><TrashIcon className="w-5 h-5 cursor-pointer mr-2" onClick={() => deleteAgendaItem(agenda.id)} /></div>
                    </li>
                )}
            </ul>

            <form onSubmit={handleSubmit} className="col-start-3 col-end-7 flex flex-col items-center">
                <Textarea
                    value={inputValue}
                    onChange={handleChange}
                    autosize
                    minRows={4}
                    required={true}
                    className="w-3/4 mt-1"
                    classNames={{ input: 'bg-gray-100 border-black'}}
                />
                <Button color="dark" type="submit" className="bg-black w-1/4 mt-4">Add Agenda Item </Button>
            </form>
        </>
    )
}
