import { useState, Fragment } from 'react'
import Agenda from '@/Components/Agenda'
import CreatableSelect from 'react-select/creatable'
import Minutes from '@/Components/Minutes'
import Select from 'react-select'
import Tasks from '@/Components/Tasks'

export default function NewMeeting({meeting, tenants}) {
    const [register, updateRegister] = useState([])
    const [lateRegister, updateLateRegister] = useState([])

    const notInAttendance = tenants.filter(option => !(register.some(item => item.value === option.value) || lateRegister.some(item => item.value === option.value)))

    return (
        <>
            <div> Start Time: {meeting.time_of_meeting} </div>
            <div> Attending
                <Select
                    isMulti
                    name="attendance"
                    options={notInAttendance}
                    className="basic-multi-select w-1/2"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    noOptionsMessage={() => null}
                    onChange={(e) => updateRegister([...e])}
                />
            </div>

            <div> Late
                <Select
                    isMulti
                    name="late"
                    options={notInAttendance}
                    className="basic-multi-select w-1/4"
                    classNamePrefix="select"
                    noOptionsMessage={() => "Everyone is in attendance"}
                    onChange={(e) => updateLateRegister([...e])}
                />
            </div>

            <div> Guests
                <CreatableSelect
                    className="w-1/4"
                    isMulti
                    noOptionsMessage={() => "Type to add Guest"}
                />
            </div>

            <div className="mt-10">
                Agenda
                <Agenda />
            </div>
            <div className="mt-10">
                Minutes
                <Minutes meetingID={meeting.id} />
            </div>
            <div className="mt-10">
                Tasks
                <Tasks />
            </div>
        </>
    )
}
