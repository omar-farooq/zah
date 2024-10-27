import { Button } from '@mantine/core'
import { CheckIcon } from '@heroicons/react/24/solid';
import { ComponentTitle } from '@/Components/Meeting'
import { DatePickerInput } from '@mantine/dates';
import { DateTimeToUKLocale } from '@/Shared/Functions'
import { MultiSelect } from '@mantine/core'
import { useState, useEffect, useReducer } from 'react'
import Input from '@/Components/Input'

export default function Tasks() {

    const initialState = {
        taskList: [],
        inputValue: '',
        date: null,
        tenants: [],
        selectedTenants: [],
    }

    function reducer(tasks, action) {
        switch (action.type) {
            case 'initialFetch':
                return {...tasks, taskList: action.fetchedTasks, tenants: action.fetchedTenants}
            case 'type':
                return {...tasks, inputValue: action.value}
            case 'selectTenants':
                return {...tasks, selectedTenants: tasks.tenants.reduce((a,b) => {
                        if(action.values.some(x => x == b.value)) {
                            return [...a, {id: b.value, name: b.label}]
                        } else {
                            return [...a]
                        }
                    },[])
                }
			case 'setDate':
				return {...tasks, date: action.value}
            case 'add':
                if(!tasks.taskList.find(x => x.id == action.id)) {
                    return {
                        ...tasks, 
                        taskList: [
                            ...tasks.taskList, 
                            {
                                id: action.id, 
                                item: action.item, 
                                due_by: action.date ? action.date.toString() : '', 
                                users: action.users, 
                                completed: 0
                            }
                        ], 
                        inputValue: '', 
                        date: null, 
                        selectedTenants: []
                    }
                } else {
                    return tasks
                }
			case 'complete':
                let y = tasks.taskList.find(z => z.id == action.itemId)
			    if(y) {
					return {...tasks, taskList: [...tasks.taskList.filter(z => z.id !== action.itemId), {...y, completed: 1}]}
				} else {
					return tasks
				}
            case 'delete':
                return tasks.taskList.filter(x => x.id != action.itemId)
        }
    }

	const [tasks, dispatch] = useReducer(reducer, initialState)

    //When user hits the submit button for new task
    async function handleSubmit(e) {
        e.preventDefault()        
        if(tasks.inputValue.length < 3) {
           return
        }
        axios.post('/tasks', {
            item: tasks.inputValue, 
            due_by: tasks.date, 
            users: tasks.selectedTenants.map(x => (
                x.id
            ))
        })
    }

    //Receive the current task items via an api call
    useEffect(() => {
        async function initialFetch() { 
            let initialTaskList = await axios.get('/tasks?completed="0"')
            let tenants = await axios.get('/tenants')
            dispatch({
                type: 'initialFetch', 
                fetchedTasks: initialTaskList.data.tasks, 
                fetchedTenants: tenants.data.tenants.map(x => ({
                    value: x.id,
                    label: x.name
                }))
            })
        }
        initialFetch()

        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting`)
            .listen('.TaskCreated', (e) => {
                const getUsers = async () => {
                    let newTask = await axios.get('/tasks?id='+e.model.id)
                    dispatch({type: 'add', id: e.model.id, item: e.model.item, date: e.model.due_by, users: newTask.data.tasks[0].users})
                }
                getUsers()
            })
            .listen('.TaskDeleted', (e) => {
                dispatch({type: 'delete', itemId: e.model.id})
            })
			.listen('.TaskUpdated', (e) => {
				if(e.model.completed == 1) {
					dispatch({type: 'complete', itemId: e.model.id})
				}
			})
        return () => {
            Echo.private(`meeting`).stopListening('.TaskCreated').stopListening('.TaskUpdated').stopListening('.TaskDeleted')
            Echo.leaveChannel('meeting')
        }
    }, [])

    //Handle the success button being clicked
    function completeTaskItem(itemId) {
        axios.patch('/tasks/' + itemId)
    }

    //Handle the delete button being clicked
    function deleteTaskItem(itemId) {
        axios.delete('/tasks/' + itemId)
    }

    return (
        <>
            <ComponentTitle bg="bg-amber-600">
                Tasks
            </ComponentTitle>
            <table className="table-auto col-start-1 col-end-9 mb-4 border border-collapse border-slate-800 bg-orange-100 w-full">
                <thead>
                    <tr>
                        <th className="border border-collapse border-slate-600">Task</th>
                        <th className="border border-collapse border-slate-600">Assigned to</th>
                        <th className="border border-collapse border-slate-600">Due by</th>
                        <th className="border border-collapse border-slate-600"/>
                    </tr>
                </thead>
                <tbody>
                    {tasks.taskList.map(task =>
                        <tr key={task.id} className={`${task.completed == 0 ? '' : 'line-through decoration-green-500 decoration-2'}`}>
                            <td className="border border-collapse border-slate-600" >{task.item}</td>
                            <td className="border border-collapse border-slate-600">{task.users.map((x,i) => i == task.users.length - 1 ? x.name : x.name + ', ')}</td>
                            <td className="border border-collapse border-slate-600">{task.due_by ? new Date(task.due_by).toDateString() : ''}</td>
                            <td className="border border-collapse border-slate-600"><CheckIcon className="h-6 w-6 text-green-400 cursor-pointer hover:text-green-600 ml-2" onClick={() => completeTaskItem(task.id)} /></td>
                        </tr>
                    )}
                </tbody>
            </table>

            <form onSubmit={handleSubmit} className="col-start-1 xl:col-start-3 col-end-9 xl:col-end-7 grid grid-cols-4 gap-2">
                <div className="col-start-1 col-end-5">
                    <Input 
                        type="text" 
                        value={tasks.inputValue} 
                        required={true} 
                        handleChange={(e) => dispatch({type: 'type', value: e.target.value})} 
                        className="w-full"
                        placeholder="Enter task"
                    />
                </div>
                <div className="col-start-1 col-end-3">
                    <MultiSelect 
                        value={tasks.selectedTenants.map(x => (
                            x.id
                        ))}
                        placeholder="Assign to..." 
                        data={tasks.tenants}
                        label="Assign to members"
                        onChange={(e) => dispatch({type: 'selectTenants', values: e})}
                    />
                </div>
                <div className="field col-12 md:col-4 col-start-3 col-end-5">
                    <label>Due by</label>
                    <DatePickerInput
                        value={tasks.date}
                        onChange={(e) => dispatch({type: 'setDate', value: e})}
                        placeholder="Due by (optional)"
                        className="bg-white"
                        minDate={new Date}
                    />
                </div>

                <Button color="dark" type="submit" className="bg-black mt-4 col-start-1 col-end-5 w-1/2 md:w-1/3 lg:w-1/2 place-self-center">Assign Task</Button>
                
            </form>
        </>
    )
}
