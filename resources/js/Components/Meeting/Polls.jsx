import { Button, Modal } from '@mantine/core'
import { ComponentTitle, CreatePoll, DisplayPoll } from '@/Components/Meeting'
import { useState, useEffect, useReducer } from 'react'


export default function Polls({auth}) {
    const [opened, setOpened] = useState(false)



    const [polls, setPolls] = useState([])

    const getPolls = async () => {
        let res = await axios.get('/poll?meeting=current')
        setPolls(res.data.polls)
    }
    
    useEffect(() => {
        getPolls()

        Echo.private(`meeting`)
        .listen('.PollCreated', (e) => {
            getPolls()
        })
        .listen('.PollDeleted', (e) => {
            getPolls()
        })
        .listen('.VoteCreated', (e) => {
            getPolls()
        })
        .listen('.VoteUpdated', (e) => {
            getPolls()
        })

        return () => {
            Echo.private(`meeting`).stopListening('.PollCreated').stopListening('.PollDeleted').stopListening('.VoteCreated').stopListening('.VoteUpdated')
            Echo.leaveChannel('meeting')
        }
    },[])

    return (
        <>
            <ComponentTitle bg="bg-rose-600">
                Polls
            </ComponentTitle>

            <div className="col-start-1 col-end-9">
                {
                    polls.length === 0 ?
                        <div className="text-2xl mb-4">There are no polls</div>
                    :
                        polls.map(poll => ( 
                            <DisplayPoll auth={auth} poll={poll} key={poll.id} />
                        ))
                }
            </div>
                <Button color="dark" className="col-start-1 col-end-9 bg-black w-1/2 md:w-1/3 xl:w-1/4 place-self-center top-4" onClick={() => setOpened(true)}>Create new poll</Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Create Poll"
            >
                <CreatePoll modalState={[opened, setOpened]} />

            </Modal>
        </>
    )
}
