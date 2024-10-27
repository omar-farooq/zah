import { Fragment, useState } from 'react'
import { DateTimeToUKDate } from '@/Shared/Functions'
import { Pagination } from '@mantine/core'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

import Tasks from '@/Components/Meeting/Tasks'

export default function TasksIndex({completedTasksPageOne}) {

    const [completedTasks, setCompletedTasks] = useState(completedTasksPageOne)
    const getCompletedTasks = async (page) => {
        let res = await axios.get('/tasks/?index&getCompleted&page='+page)
        setCompletedTasks(res.data)
    }

    return (
        <>
            <div className="lg:w-2/3 my-10">
                <Tasks />
            </div>
            <div className="w-full flex flex-col items-center">
                <div className="text-2xl">Previous Tasks</div>
                <Table>
                    <THead>
                        <TH heading="Task" />
                        <TH heading="Date marked as complete" />
                    </THead>
                    <TBody>
                        {completedTasks.data.map(x =>
                            <Fragment key={x.id}>
                                <tr>
                                    <TD data={x.item} />
                                    <TD data={DateTimeToUKDate(x.updated_at)} />
                                </tr>
                            </Fragment>
                        )}
                    </TBody>
                </Table>
            </div>
            <Pagination
                className="mt-5 mb-10"
                total={completedTasks.last_page}
                page={completedTasks.current_page}
                onChange={(e) => getCompletedTasks(e)}
                withEdges
            />
        </>
    )
}
