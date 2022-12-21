import { Button, Modal } from '@mantine/core'
import { ComponentTitle, CreatePoll } from '@/Components/Meeting'
import { useState, useEffect } from 'react'


export default function Polls() {
    const [opened, setOpened] = useState(false)
    const [polls, setPolls] = useState([])

    useEffect(() => {
        const getPolls = async () => {
            let res = await axios.get('/poll?meeting=current')
            setPolls(res.data.polls)
        }
        getPolls()
    },[])
    
    return (
        <>
            <ComponentTitle bg="bg-rose-600">
                Polls
            </ComponentTitle>

            <div className="col-start-3">
                {polls.map(poll => ( 
                    <ul key={poll.id}>
                        {poll.name}
                            {poll.poll_items.map(option => (
                                <li key={option.id}>
                                    {option.option}
                                </li>
                            ))}
                    </ul>
                ))}
                <Button onClick={() => setOpened(true)}>Create Poll</Button>
            </div>

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
