import { Button } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Agenda, ComponentWrapper, ComponentWrapperWhite, Documents, Minutes, MinutesReadAndAgreed, PreviousMinutes, SecretaryReport, Polls, Register, Tasks } from '@/Components/Meeting'
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
    const timeOfMeetingEpoch = new Date(meeting.time_of_meeting).getTime()

    //Handle minutes read and agrees
    const [minutesRead, setMinutesRead] = useState(false)

    //Join the channel via a websocket
    useEffect(() => {
        Echo.private(`meeting`)
            .listen('.MeetingUpdated', (e) => {
                if(e.model.minutes_read_and_agreed == 0) {
                    setMinutesRead(false)
                } else {
                    setMinutesRead(true)
                }

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
            <div className="text-xl xl:text-3xl mt-3 mb-3"> Minutes: {meeting.time_of_meeting} </div>
            {
                cancelled ?
                    <div>Meeting Cancelled</div>
                : Date.now() < (timeOfMeetingEpoch - 600000) ?
                    <>
                        <div className="text-lg my-6">The meeting has not started yet. You can join 10 minutes before the start of the meeting.</div>
                        <div className="w-full lg:w-1/2 mt-4 mb-4">
                            <Agenda
                                auth={auth}
                                meetingId={meeting.id}
                            />
                        </div>
                    </>
                :
                    <>
                        <div className="lg:w-2/3 w-full flex lg:justify-end relative lg:-top-10">
                            <button className="text-red-500 hover:text-red-600" onClick={() => modalHandlers.open()}>Cancel</button>
                        </div>

                        <ConfirmModal
                            title="Confirm Meeting Cancellation"
                            text={<p>Are you sure you want to cancel this meeting?</p>}
                            confirmFunction={() => {cancelMeeting(); modalHandlers.close()}}
                            cancelFunction={() => modalHandlers.close()}
                            modalOpened={modalOpened}
                        />

                        <Register 
                            tenants={tenants} 
                            meeting={meeting} 
                        />

                        <ComponentWrapperWhite>
                            <PreviousMinutes />
                        </ComponentWrapperWhite>

                        <MinutesReadAndAgreed 
                            meetingId={meeting.id}
                            minutesReadHook={[minutesRead, setMinutesRead]}
                        />

                        <ComponentWrapperWhite>
                            <Agenda 
                                auth={auth} 
                                meetingId={meeting.id}
                            />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <Documents 
                                auth={auth} 
                                meetingId={meeting.id}
                            />
                        </ComponentWrapperWhite>

                        <ComponentWrapperWhite>
                            <SecretaryReport auth={auth} />
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
                            text={<p>Are you sure you want to submit this meeting?</p>}
                            confirmFunction={() => {submitMeeting(); submitModalHandlers.close()}}
                            cancelFunction={() => submitModalHandlers.close()}
                            modalOpened={submitModalOpened}
                        />
                    </>
            }
        </>
            
    )
}
