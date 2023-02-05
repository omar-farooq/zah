import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea } from '@mantine/core'
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const useStyles = createStyles((theme) => ({
      item: {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            },

      dragHandle: {
              ...theme.fn.focusStyles(),
              width: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
            },
}));

export default function Plan({fiveYearPlan}) {
    const { classes } = useStyles()
    const [state, handlers] = useListState(fiveYearPlan);

    const [fiveYearPlanComponent, setFiveYearPlanComponent] = useState({priority: state.length + 1, component: '', cost: '', plan_length: '5y'})
    const [tenYearPlanComponent, setTenYearPlanComponent] = useState({component: '', cost: ''})

    useEffect(() => {
        const updatePlan = async () => {
            state.forEach((c,i) => {
                if(c.priority != i + 1) {
                    axios.patch('/treasury-plans/'+c.id, {priority: i+1})
                }
            })
            handlers.apply((item, index) => ({...item, priority: index + 1}))
        }
        if(state.find((x,i) => x.priority != i + 1)) {
            updatePlan()
        }
    },[state])

      const items = state.map((item, index) => (
              <Draggable key={item.component} index={index} draggableId={item.component}>
                {(provided) => (
                            <tr className={classes.item} ref={provided.innerRef} {...provided.draggableProps}>
                              <td>
                                <div className={classes.dragHandle} {...provided.dragHandleProps}>
                                  <EllipsisVerticalIcon className="h-6 w-6"/>
                                </div>
                              </td>
                              <td style={{ width: 80 }}>{item.priority}</td>
                              <td style={{ width: 120 }}>{item.component}</td>
                              <td style={{ width: 80 }}>{item.cost}</td>
                              <td><button onClick={() => handleDelete(item.id)}>del</button></td>
                            </tr>
                          )}
              </Draggable>
            ));

    const handleAppend = async (e) => {
        e.preventDefault()
        if(fiveYearPlanComponent.component && fiveYearPlanComponent.cost) {
            await axios.post('/treasury-plans', fiveYearPlanComponent)
            handlers.append(fiveYearPlanComponent)
            setFiveYearPlanComponent({component: '', cost: '', priority: fiveYearPlanComponent.priority + 1, plan_length: '5y'})
        }
    }

    const handleDelete = async(id) => {
        await axios.delete('/treasury-plans/'+id)
        handlers.filter((component) => component.id !== id)
    }

    return (
        <>
            <div>
                Available budget: £50000
                Expected outgoing (5 years): £10000
                Expected incoming: (5 years): £80000
            </div>
            <ScrollArea>
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                              if(!destination) {
                                console.log('deleted')
                              }
                              handlers.reorder({ from: source.index, to: destination?.index || 0 });
                            }}
              >
                <Table sx={{ minWidth: 420, '& tbody tr td': { borderBottom: 0 } }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }} />
                      <th style={{ width: 80 }}>Priority</th>
                      <th style={{ width: 120 }}>Component</th>
                      <th style={{ width: 40 }}>Cost</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <Droppable droppableId="5y-list" direction="vertical">
                    {(provided) => (
                                      <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                        {items}
                                        {provided.placeholder}
                                      </tbody>
                                    )}
                  </Droppable>
                </Table>
              </DragDropContext>
            </ScrollArea>

            <div className="mt-4">Add a new 5 year plan component</div>
            <form className="flex flex-col">
                <input 
                    type="text" 
                    placeholder="name" 
                    value={fiveYearPlanComponent.component}
                    onChange={(e) => setFiveYearPlanComponent({...fiveYearPlanComponent, component: e.target.value})}
                    className="h-9 mb-2 rounded-xl" 
                />
                <input 
                    type="number" 
                    placeholder="cost" 
                    value={fiveYearPlanComponent.cost}
                    onChange={(e) => setFiveYearPlanComponent({...fiveYearPlanComponent, cost: e.target.value})}
                    className="h-9 mb-2 rounded-xl" 
                />
                <button onClick={handleAppend}>add</button>
            </form>
        </>
    )
}
