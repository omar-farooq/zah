import { Button } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Agenda, ComponentWrapper, ComponentWrapperWhite, Minutes, SecretaryReport, Polls, Register, Tasks } from '@/Components/Meeting'
import { useDisclosure } from '@mantine/hooks'
import ConfirmModal from '@/Components/ConfirmModal'

export default function NewMeeting({meeting, tenants, auth}) {
    
    //handle submit
    const [submitModalOpened, submitModalHandlers] = useDisclosure(false)
    const submitMeeting = async () => {
       await axios.patch('/meetings/'+meeting.id)
       window.location = "/meetings/"+meeting.id
    }

    //Handle meeting cancellation
    const [cancelled, setCancelled] = useState(false)
    const [modalOpened, modalHandlers] = useDisclosure(false)
    const cancelMeeting = async () => {
        await axios.delete('/meetings/'+meeting.id)
        setCancelled(true)
    }

    //Join the channel via a websocket
    useEffect(() => {
        Echo.private(`meeting`)
            .listen('.MeetingUpdated', (e) => {
                console.log(e.model.completed)
                if(e.model.cancelled == 1) {
                    setCancelled(true)
                }
                if(e.model.completed == 1) {
                    window.location = "/meetings/"+meeting.id
                }
            })
        return function cleanup() {
            Echo.leaveChannel('meeting')
        }
    }, [])

    return (
        <>
            <div className="text-xl mt-3 mb-3"> Meeting: {meeting.time_of_meeting} </div>
            {
                cancelled ?
                    <div>Meeting Cancelled</div>
                :
                    <>
                        <div className="lg:w-2/3 w-full flex lg:justify-end relative lg:-top-10">
                            <button className="text-red-500 hover:text-red-600" onClick={() => modalHandlers.open()}>Cancel</button>
                        </div>

                        <ConfirmModal
                            title="Confirm Meeting Cancellation"
                            text=<p>Are you sure you want to cancel this meeting?</p>
                            confirmFunction={() => {cancelMeeting(); modalHandlers.close()}}
                            cancelFunction={() => modalHandlers.close()}
                            modalOpened={modalOpened}
                        />

                        <Register 
                            tenants={tenants} 
                            meeting={meeting} 
                        />

                        <ComponentWrapperWhite>
                            <Agenda />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <SecretaryReport />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <Minutes meetingID={meeting.id} />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <Tasks />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <Polls auth={auth} />
                        </ComponentWrapperWhite>

                        <Button className="mb-14 mt-14 w-1/2 lg:w-1/4" variant="outline" onClick={() => submitModalHandlers.open()}>
                            Submit Meeting
                        </Button>

                        <ConfirmModal
                            title="Confirm Meeting Submission"
                            text=<p>Are you sure you want to submit this meeting?</p>
                            confirmFunction={() => {submitMeeting(); submitModalHandlers.close()}}
                            cancelFunction={() => submitModalHandlers.close()}
                            modalOpened={submitModalOpened}
                        />
                    </>
            }
        </>
            
    )
}
