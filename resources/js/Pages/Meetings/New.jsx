import { useState, Fragment } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Agenda from '@/Components/Agenda'
import Minutes from '@/Components/Minutes'
import Tasks from '@/Components/Tasks'

export default function NewMeeting() {
    const [register, updateRegister] = useState([])
    const [lateRegister, updateLateRegister] = useState([])
    const options = [
           {value: 'person1', label: 'person 1'},
           {value: 'person2', label: 'person 2'},
           {value: 'person3', label: 'person 3'},
           ]

    const notInAttendance = options.filter(option => !(register.some(item => item.value === option.value) || lateRegister.some(item => item.value === option.value)))

    return (
        <>
            <div> Attending
                <Select
                    defaultValue={[options[1]]}
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
                <Minutes />
            </div>
            <div className="mt-10">
                Tasks
                <Tasks />
            </div>
        </>
    )
}
