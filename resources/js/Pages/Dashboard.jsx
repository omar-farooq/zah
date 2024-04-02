import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Head } from '@inertiajs/inertia-react';
import { ComponentWrapperWhite, SecretaryReport } from '@/Components/Meeting';

export default function Dashboard(props) {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            let taskRes = await axios.get('/tasks?completed=false&user_id='+props.auth.user.id)
            setTasks(taskRes.data.tasks)
        }
        getTasks()
    },[])

    async function completeTaskItem(itemId) {
        await axios.patch('/tasks/' + itemId)
        setTasks([...tasks.filter(x => x.id !== itemId), {...tasks.find(x => x.id === itemId), completed: 1}])
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200"> Welcome back {props.auth.user.name}. You're logged in!</div>

                    </div>
                </div>
            </div>
            {
                tasks.length > 0 ?
                <>
                <div className="text-xl w-full text-center">Assigned Tasks</div>
                <table className="table-auto mb-4 border border-collapse border-slate-800 bg-white min-w-fit w-1/3">
                    <thead>
                        <tr>
                            <th className="border border-collapse border-slate-600">Task</th>
                            <th className="border border-collapse border-slate-600">Due by</th>
                            <th className="border border-collapse border-slate-600"/>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task =>
                            <tr key={task.id} className={`${task.completed == 0 ? '' : 'line-through decoration-green-500 decoration-2'}`}>
                                <td className="border border-collapse border-slate-600 text-center" >{task.item}</td>
                                <td className="border border-collapse border-slate-600 text-center">{task.due_by ? new Date(task.due_by).toDateString() : ''}</td>
                                <td className="border border-collapse border-slate-600 text-center"><CheckIcon className="h-6 w-6 text-green-400 cursor-pointer hover:text-green-600 ml-2" onClick={() => completeTaskItem(task.id)} /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </>
                :
                <div className="text-xl w-full text-center">You have no assigned tasks</div>
            }
            {
                props.auth.user.role.name == "Secretary" ?
                    <ComponentWrapperWhite>
                        <SecretaryReport />
                    </ComponentWrapperWhite>
                    
                : ''
            }
        </>
    );
}
