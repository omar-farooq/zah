import { Button } from '@mantine/core'
import { useState, useEffect, Fragment } from 'react'
import { Agenda, ComponentWrapper, Minutes, SecretaryReport, Polls, Tasks } from '@/Components/Meeting'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

export default function NewMeeting({meeting, tenants, auth}) {
    
    //Define the register array destructuring
    const [register, updateRegister] = useState([])
    const [lateRegister, updateLateRegister] = useState([])
    const [guests, updateGuests] = useState([])

    //for the modal
    const [opened, setOpened] = useState(false)

    const notInAttendance = tenants.filter(option => !(register.some(item => item.value === option.value) || lateRegister.some(item => item.value === option.value)))

    const handleSubmit = async () => {
        axios.post('/meetings/register-attendance', {meetingID: meeting.id, Attendees: register, LateAttendees: lateRegister, Guests: guests})
        axios.patch('/meetings/'+meeting.id)
    }

    return (
        <>
            <div className="text-xl mt-3 mb-3"> Meeting: {meeting.time_of_meeting} </div>
            <div className="grid grid-cols-4 w-full gap-2">
                <div className="lg:col-start-2 lg:col-end-4 col-start-1 col-end-5"> Attending
                    <Select
                        isMulti
                        name="attendance"
                        options={notInAttendance}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        closeMenuOnSelect={false}
                        noOptionsMessage={() => null}
                        onChange={(e) => updateRegister([...e])}
                    />
                </div>

                <div className="lg:col-start-2 col-end-3 col-start-1"> 
                    <Select
                        isMulti
                        name="late"
                        options={notInAttendance}
                        className="basic-multi-select"
                        placeholder="Late"
                        classNamePrefix="select"
                        noOptionsMessage={() => "Everyone is in attendance"}
                        onChange={(e) => updateLateRegister([...e])}
                    />
                </div>

                <div className="col-start-3 lg:col-end-4 col-end-5">
                    <CreatableSelect
                        isMulti
                        placeholder="Guests"
                        noOptionsMessage={() => "Type to add Guest"}
                        onChange={(e) => updateGuests([...e])}
                    />
                </div>
            </div>

            <ComponentWrapper>
                <Agenda />
            </ComponentWrapper>

            <div className="mt-10 w-full">
                <SecretaryReport />
            </div>

            <ComponentWrapper>
                <Minutes meetingID={meeting.id} />
            </ComponentWrapper>

            <ComponentWrapper>
                <Tasks />
            </ComponentWrapper>

            <ComponentWrapper>
                <Polls auth={auth} />
            </ComponentWrapper>

            <Button className="mb-14 mt-14 w-1/2 lg:w-1/4" variant="outline" onClick={() => handleSubmit()}>
                Submit Meeting
            </Button>
        </>
    )
}
