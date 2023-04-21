import { Button } from '@mantine/core'
import { Fragment, useReducer } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import Input from '@/Components/Input'

export default function CreatePoll({modalState}) {

    const [opened, setOpened] = modalState

    const initialPollState = {
        key: 3,
        title: '',
        items: [
            {id: 1, value: ''},
            {id: 2, value: ''},
        ],
        ends: {
            days: '',
            hours: '',
            minutes: ''
        }
    }


    function updatePoll(currentPoll, action) {
        switch (action.type) {
            case 'updateTitle':
                return {...currentPoll, title: action.title}

            case 'updatePollItem':
                return {...currentPoll, items: currentPoll.items.map(item => {
                    if(item.id == action.id) {
                        item.value = action.value
                    }
                    return item
                })}

            case 'deletePollItem':
                return currentPoll.items.length > 2 ? {...currentPoll, items: [...currentPoll.items.filter(item => item.id != action.id)]} : {...currentPoll}

            case 'addPollItem':
                return {...currentPoll, items: [...currentPoll.items, {id: currentPoll.key, value: ''}], key: currentPoll.key + 1}

            case 'updateEndTime':
                return {...currentPoll, ends: {...currentPoll.ends, [action.metric]: action.value}}
        }
    }

    const [currentPoll, dispatch] = useReducer(updatePoll, initialPollState)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const timeToEnd = (currentPoll.ends.days * 24 * 60 * 60000) + (currentPoll.ends.hours * 60 * 60000) + (currentPoll.ends.minutes * 60000)

        await axios.post('/poll', {
            title: currentPoll.title, 
            options: currentPoll.items.map(x => ({option: x.value})),
            end: new Date(Date.now() + timeToEnd)
        })
        setOpened(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Poll Title</label>
            <Input 
                name="poll name"
                required={true}
                handleChange={(e) => dispatch({type: 'updateTitle', title: e.target.value})}
                className="mb-6"
            />

            {currentPoll.items.map((x,i) => 
                <Fragment key={x.id}>
                    <div className="flex flex-row">
                        <Input
                            name="poll item"
                            placeholder={`poll item ${i+1}`}
                            value={x.value}
                            handleChange={(e) => dispatch({type: 'updatePollItem', value: e.target.value, id: x.id})}
                            className="mt-1"
                        />
                        <button 
                            onClick={() => dispatch({type: 'deletePollItem', id: x.id})} 
                            className="text-red-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </Fragment>
            )}
            <br />
            <Button 
                onClick={() => dispatch({type: 'addPollItem'})}
                className="bg-emerald-700 hover:bg-emerald-700 h-8"
            >
                add item
            </Button>
            <div className="hidden">
                End Poll in 
                <input 
                    type="number"
                    className="w-1/4"
                    onChange={(e) => dispatch({type: 'updateEndTime', metric: 'days', value: e.target.value})}
                />
                days
                <input
                    type="number"
                    className="w-1/4"
                    max="23"
                    onChange={(e) => dispatch({type: 'updateEndTime', metric: 'hours', value: e.target.value})}
                />
                hours
                <input
                    type="number"
                    className="w-1/4"
                    max="59"
                    onChange={(e) => dispatch({type: 'updateEndTime', metric: 'minutes', value: e.target.value})}
                />
                minutes
            </div>
            <div>
                <Button 
                    type="submit"
                    className="hover:bg-blue-500 bg-blue-500 mt-2"
                >
                    Create Poll
                </Button>
            </div>
        </form>
    )
}
