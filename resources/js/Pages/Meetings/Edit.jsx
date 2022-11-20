import { Button } from '@mantine/core'
import { useState, useEffect, Fragment } from 'react'
import { ComponentWrapper, SecretaryReport } from '@/Components/Meeting'
import Agenda from '@/Components/Agenda'
import CreatableSelect from 'react-select/creatable'
import Minutes from '@/Components/Minutes'
import Select from 'react-select'
import Tasks from '@/Components/Tasks'

export default function NewMeeting({meeting, tenants}) {
    const [register, updateRegister] = useState([])
    const [lateRegister, updateLateRegister] = useState([])
    const [guests, updateGuests] = useState([])

    const notInAttendance = tenants.filter(option => !(register.some(item => item.value === option.value) || lateRegister.some(item => item.value === option.value)))

    const handleSubmit = async () => {
        axios.post('/meetings/register-attendance', {meetingID: meeting.id, Attendees: register, LateAttendees: lateRegister, Guests: guests})
        axios.patch('/meetings/'+meeting.id)
    }

    return (
        <>
            <div className="text-xl mt-3 mb-3"> Meeting: {meeting.time_of_meeting} </div>
            <div className="grid grid-cols-4 w-full gap-2">
                <div className="col-start-2 col-end-4"> Attending
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

                <div className="col-start-2 col-end-3"> 
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

                <div className="col-start-3 col-end-4">
                    <CreatableSelect
                        isMulti
                        placeholder="Guests"
                        noOptionsMessage={() => "Type to add Guest"}
                        onChange={(e) => updateGuests([...e])}
                    />
                </div>
            </div>

            <div className="mt-10 w-full">
                <SecretaryReport />
            </div>

            <ComponentWrapper>
                <Agenda />
            </ComponentWrapper>

            <ComponentWrapper>
                <Minutes meetingID={meeting.id} />
            </ComponentWrapper>

            <div className="mt-10 w-full">
                Tasks
                <Tasks />
            </div>

            <Button className="mb-10 mt-6" variant="outline" onClick={() => handleSubmit()}>
                Submit Meeting
            </Button>
        </>
    )
}
