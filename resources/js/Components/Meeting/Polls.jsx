import { Button, Modal } from '@mantine/core'
import { ComponentTitle, CreatePoll, DisplayPoll } from '@/Components/Meeting'
import { useState, useEffect } from 'react'


export default function Polls({auth}) {
    const [opened, setOpened] = useState(false)
    const [polls, setPolls] = useState([])

    const getPolls = async () => {
        let res = await axios.get('/poll?meeting=current')
        setPolls(res.data.polls)
    }
    
    useEffect(() => {
        getPolls()
    },[])

    return (
        <>
            <ComponentTitle bg="bg-rose-600">
                Polls
            </ComponentTitle>

            <div className="col-start-1 lg:col-start-3 col-end-9 lg:col-end-5">
                {polls.map(poll => ( 
                    <DisplayPoll auth={auth} poll={poll} key={poll.id} getPolls={getPolls} />
                ))}
            </div>
                <Button color="dark" className="col-start-2 lg:col-start-4 col-end-8 lg:col-end-6 bg-black w-1/2 place-self-center mb-10" onClick={() => setOpened(true)}>Create new poll</Button>

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
