import { Button, Modal } from '@mantine/core'
import { ComponentTitle, CreatePoll, DisplayPoll } from '@/Components/Meeting'
import { useState, useEffect, useReducer } from 'react'


export default function Polls({auth}) {
    const [opened, setOpened] = useState(false)

    const initialPollState = []

    function reducer(polls, action) {
        switch (action.type) {
            case 'initialFetch':
                return action.fetchedPolls
            case 'add':
                if(!polls.find(x => x.id == action.model.id)) {
                    return [...polls, action.model]
                } else {
                    return polls
                }
            case 'vote':
                let findPoll = polls.find(x => x.poll_items.find(y => y.id === action.vote.poll_option_id))
                let findPollItem = findPoll.poll_items.find(z => z.id === action.vote.poll_option_id)
                let findVote = findPoll.poll_items.find(z => z.votes.some(α => α.id === action.vote.id))
                if(!findVote) {
                    return [...polls.filter(β => β != findPoll), {
                        ...findPoll, 
                        poll_items: [
                            ...findPoll.poll_items.filter(γ => γ != findPollItem), 
                            {
                                ...findPollItem, 
                                votes: [
                                    ...findPollItem.votes, 
                                    action.vote
                                ]
                            }
                        ]
                    }]
                } else {
                    return polls
                }

            case 'changeVote':
                let findChangedPoll = polls.find(x => x.poll_items.find(y => y.id === action.vote.poll_option_id))
                let findChangedPollItem = findChangedPoll.poll_items.find(z => z.id === action.vote.poll_option_id)
                let findOriginalPollItem = findChangedPoll.poll_items.find(z => z.votes.some(α => α.user_id === action.vote.user_id))
                return [...polls.filter(β => β != findChangedPoll), {
                    ...findChangedPoll, 
                    poll_items: [
                        ...findChangedPoll.poll_items.filter(γ => γ != findChangedPollItem && γ != findOriginalPollItem), 
                        {
                            ...findOriginalPollItem,
                            votes: [...findOriginalPollItem.votes.filter(δ => δ.user_id != action.vote.user_id)]
                        },
                        {
                            ...findChangedPollItem, 
                            votes: [
                                ...findChangedPollItem.votes.filter(δ => δ.id != action.vote.id), 
                                action.vote
                            ]
                        }
                    ]
                }]

        }
    }

    const [polls, dispatch] = useReducer(reducer, initialPollState)

    const getPolls = async () => {
        let res = await axios.get('/poll?meeting=current')
        dispatch({type: 'initialFetch', fetchedPolls: res.data.polls})
    }
    
    useEffect(() => {
        getPolls()

        Echo.private(`meeting`)
        .listen('.PollCreated', (e) => {
            dispatch({type: 'add', model: e.model})
        })
        .listen('.VoteCreated', (e) => {
            getPolls()
 //           dispatch({type: 'vote', vote: e.model})
        })
        .listen('.VoteUpdated', (e) => {
            getPolls()
//            dispatch({type: 'changeVote', vote: e.model})
        })
    },[])

    return (
        <>
            <ComponentTitle bg="bg-rose-600">
                Polls
            </ComponentTitle>

            <div className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-7">
                {
                    polls.length === 0 ?
                        <div className="text-2xl">There are no polls</div>
                    :
                        polls.map(poll => ( 
                            <DisplayPoll auth={auth} poll={poll} key={poll.id} dispatch={dispatch} />
                        ))
                }
            </div>
                <Button color="dark" className="col-start-1 lg:col-start-4 col-end-9 lg:col-end-6 bg-black w-1/2 place-self-center mb-10" onClick={() => setOpened(true)}>Create new poll</Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Create Poll"
            >
                <CreatePoll />

            </Modal>
        </>
    )
}
