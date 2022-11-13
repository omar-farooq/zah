import { useState, useEffect } from 'react'
import Input from '@/Components/Input'
import { DatePicker } from '@mantine/dates';
import { CheckIcon } from '@heroicons/react/24/solid';
import TenantMultiSelect from '@/Components/TenantMultiSelect'

export default function Tasks() {

    //Task list
    const [reactiveTaskList, updateReactiveTaskList] = useState([])

    //Tasks form input
    const [inputValue, setInputValue] = useState('')
    const [selectedTenants, setSelectedTenants] = useState([])
    const [taskUserIds, setTaskUserIds] = useState([])

    //set the date
    const [date, setDate] = useState('')

    //When user hits the submit button for new task
    async function handleSubmit(e) {
        e.preventDefault()        
        if(inputValue.length < 3) {
           return
        }

        let response = await axios.post('/tasks', {item: inputValue, due_by: date, users: taskUserIds});
        setInputValue('')
        setSelectedTenants([])
        setTaskUserIds([])
        setDate('')
        updateReactiveTaskList([...reactiveTaskList, {id: response.data.id, item: inputValue, due_by: date.toString(), users: selectedTenants, completed: 0}])
    }

    const handleChange = () => {
        setInputValue(event.target.value)
    }

    //Receive the current task items via an api call
    useEffect(() => {
        async function GetTasks() { 
            let res = await axios.get('/tasks?completed="0"')
            updateReactiveTaskList(res.data.tasks)
        }
        GetTasks()
    }, [])

    //Handle the success button being clicked
    async function completeTaskItem(itemId) {
        await axios.patch('/tasks/' + itemId)
        console.log(reactiveTaskList.find(({id}) => id == itemId))
        updateReactiveTaskList(
            [...reactiveTaskList],
            reactiveTaskList.find(({id}) => id == itemId).completed = 1
        )
    }

    //Handle the delete button being clicked
    async function deleteTaskItem(itemId) {
        await axios.delete('/tasks/' + itemId)
        updateReactiveTaskList(reactiveTaskList.filter(x => x.id != itemId))
    }

    return (
        <>
            <ul>
                {reactiveTaskList.map(task =>
                    task.completed == 0 ?
                    <li key={task.id} className="flex flex-row">
                        {task.item} assigned to {task.users.map(x => x.name )} due by {task.due_by} 
                        <button className="hidden" onClick={() => deleteTaskItem(task.id)}>X</button>
                        <CheckIcon className="h-6 w-6 text-green-400 cursor-pointer hover:text-green-600 ml-2" onClick={() => completeTaskItem(task.id)} />
                    </li>

                    :

                    <li key={task.id} className="line-through decoration-green-500 decoration-1">
                        {task.item} assigned to {task.users.map(x => x.name )}
                    </li>

                )}
            </ul>

            <form onSubmit={handleSubmit}>
                <Input type="text" value={inputValue} required={true} handleChange={handleChange} />
                <div className="field col-12 md:col-4">
                    <DatePicker 
                        value={date}
                        onChange={(e) => setDate(e)} 
                        placeholder="Due by (optional)" 
                    />
                </div>
                <TenantMultiSelect placeholder="Assign to..." tenantFunctions={[selectedTenants, setSelectedTenants]} idFunctions={[taskUserIds, setTaskUserIds]}/>
                <input type="submit" value="Assign Task" />
            </form>
        </>
    )
}
