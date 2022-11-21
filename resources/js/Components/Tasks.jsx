import { Button } from '@mantine/core'
import { DateTimeToUKLocale } from '@/Shared/Functions'
import { ComponentTitle } from '@/Components/Meeting'
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
        setDate(null)
        updateReactiveTaskList([...reactiveTaskList, {id: response.data.id, item: inputValue, due_by: date ? date.toString() : '', users: selectedTenants, completed: 0}])
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
            <ComponentTitle bg="bg-amber-600">
                Tasks
            </ComponentTitle>
            <table className="table-auto col-start-3 col-end-7 mb-4 border border-collapse border-slate-800 bg-white">
                <thead>
                    <tr>
                        <th className="border border-collapse border-slate-600">Task</th>
                        <th className="border border-collapse border-slate-600">Assigned to</th>
                        <th className="border border-collapse border-slate-600">Due by</th>
                        <th className="border border-collapse border-slate-600"/>
                    </tr>
                </thead>
                <tbody>
                    {reactiveTaskList.map(task =>
                        <tr key={task.id} className={`${task.completed == 0 ? '' : 'line-through decoration-green-500 decoration-2'}`}>
                            <td className="border border-collapse border-slate-600" >{task.item}</td>
                            <td className="border border-collapse border-slate-600">{task.users.map(x => x.name)}</td>
                            <td className="border border-collapse border-slate-600">{task.due_by ? new Date(task.due_by).toDateString() : ''}</td>
                            <td className="border border-collapse border-slate-600"><CheckIcon className="h-6 w-6 text-green-400 cursor-pointer hover:text-green-600 ml-2" onClick={() => completeTaskItem(task.id)} /></td>
                        </tr>
                    )}
                </tbody>
            </table>

            <form onSubmit={handleSubmit} className="col-start-3 col-end-7 grid grid-cols-4 gap-2">
                <div className="col-start-1 col-end-5">
                    <Input 
                        type="text" 
                        value={inputValue} 
                        required={true} 
                        handleChange={(e) => setInputValue(e.target.value)} 
                        className="w-full"
                        placeholder="Enter task"
                    />
                </div>
                <div className="col-start-1 col-end-3">
                    <TenantMultiSelect 
                        placeholder="Assign to..." 
                        tenantFunctions={[selectedTenants, setSelectedTenants]} 
                        idFunctions={[taskUserIds, setTaskUserIds]} 
                    />
                </div>
                <div className="field col-12 md:col-4 col-start-3 col-end-5">
                    <DatePicker 
                        value={date}
                        onChange={(e) => setDate(e)} 
                        placeholder="Due by (optional)"
                        label="Due By"
                        minDate={new Date}
                    />
                </div>

                <Button color="dark" type="submit" className="bg-black mt-4 col-start-2 col-end-4 w-1/2 place-self-center">Assign Task</Button>
                
            </form>
        </>
    )
}
