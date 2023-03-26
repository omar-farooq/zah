import { useEffect, useState } from 'react'
import { createStyles, Button, Table, ScrollArea } from '@mantine/core'
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

export default function CreatePlan({lastPlan, balance, rent, weeklyRecurringPayments, monthlyRecurringPayments, annualRecurringPayments}) {
    const { classes } = useStyles()
    const [state, handlers] = useListState([]);

    const [fiveYearPlanComponent, setFiveYearPlanComponent] = useState({priority: state.length + 1, component: '', cost: '', plan_length: '5y'})
    const [tenYearPlanComponent, setTenYearPlanComponent] = useState({component: '', cost: ''})

    const [fiveYearPlanCost, setFiveYearPlanCost] = useState('')
    const [key, setKey] = useState(1)

    useEffect(() => {
        if(state.find((x,i) => x.priority != i + 1)) {
            handlers.apply((item, index) => ({...item, priority: index + 1}))
        }
    },[state])

    useEffect(() => {
        setFiveYearPlanCost(state.reduce((a,b) => {
            return Number(b.cost) + Number(a)
        },[]))
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
                        <td><button onClick={() => handleDelete(item.key)}>del</button></td>
                      </tr>
                    )}
        </Draggable>
    ));

    const handleAppend = async (e) => {
        e.preventDefault()
        if(fiveYearPlanComponent.component && fiveYearPlanComponent.cost) {
            handlers.append({...fiveYearPlanComponent, key: key})
            setKey(key+1)
            setFiveYearPlanComponent({component: '', cost: '', priority: fiveYearPlanComponent.priority + 1, plan_length: '5y'})
        }
    }

    const handleDelete = (key) => {
        handlers.filter((component) => component.key !== key)
    }

    const calculateExpectedOutgoings = () => {
        let weeklyPaymentsAfterFiveYears = weeklyRecurringPayments * 52 * 5
        let monthlyPaymentsAfterFiveYears = monthlyRecurringPayments * 12 * 5
        let annualPaymentsAfterFiveYears = annualRecurringPayments * 5
        return weeklyPaymentsAfterFiveYears + monthlyPaymentsAfterFiveYears + annualPaymentsAfterFiveYears
    }

    const calculateExpectedIncomings = () => {
        return rent * 52 * 5
    }

    const calculateRemainingBalance = () => Number(balance) + Number(calculateExpectedOutgoings()) + Number(calculateExpectedIncomings()) - fiveYearPlan.reduce((a,b) => {
       return Number(b.cost) + Number(a) 
    },[])

    const savePlan = () => {
        axios.post('/treasury-plans', {
            expected_incoming: calculateExpectedIncomings(),
            expected_outgoing: calculateExpectedOutgoings(),
            available_balance: balance,
            expected_balance: Number(balance) + Number(calculateExpectedOutgoings()) + Number(calculateExpectedIncomings()),
            estimated_remaining_balance: Number(balance) + Number(calculateExpectedOutgoings()) + Number(calculateExpectedIncomings()) - fiveYearPlanCost,
            plan_length: '5y',
            components: state
        })
    }

    return (
        <>
            <div className="grid grid-cols-6 bg-white m-4 shadow-md text-md">
                <span className="m-2 font-bold col-span-2">Expected incoming (5 years):</span> <span className="mt-2">£{calculateExpectedIncomings()}</span>
                <span className="m-2 font-bold col-span-2">Expected outgoing (5 years):</span> <span className="mt-2">£{calculateExpectedOutgoings()}</span>
                <span className="m-2 font-bold col-span-2">Available balance:</span> <span className="mt-2">£{balance}</span>
                <span className="m-2 font-bold col-span-2">Expected 5 year balance:</span><span className="mt-2"> £{Number(balance) + Number(calculateExpectedOutgoings()) + Number(calculateExpectedIncomings())}</span>
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
                <Button
                    radius="xl"
                    className="bg-sky-600 hover:bg-sky-700" 
                    onClick={handleAppend}
                >
                    add
                </Button>
            </form>

            <div className="m-4 text-xl">
                Estimated Remaining Balance: £{(Number(balance) + Number(calculateExpectedOutgoings()) + Number(calculateExpectedIncomings()) - fiveYearPlanCost).toFixed(2)}
            </div>

            <Button
                className="bg-white text-sky-500 border border-sky-500 w-48 hover:text-sky-600 hover:bg-slate-100"
                onClick={savePlan}
            >
                Save
            </Button>
        </>
    )
}
