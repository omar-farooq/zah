import { useState, useEffect, Fragment } from 'react'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

export default function Register({tenants, meeting}) {
    //Define the register array destructuring
    const [register, updateRegister] = useState(meeting.attendees.reduce((a,b) => {
		if(b.pivot.late === 0) {
			return [...a, {value: b.id, label: b.name}]
		} else {
			return a
		}
	},[]))

    const [lateRegister, updateLateRegister] = useState(meeting.attendees.reduce((a,b) => {
		if(b.pivot.late === 1) {
			return [...a, {value: b.id, label: b.name}]
		} else {
			return a
		}
	},[]))

    const [guests, updateGuests] = useState(meeting.guests.map(x => ({value: x.name, label: x.name})))

    //Set the select menu options
    const notInAttendance = tenants.filter(option => !(register.some(item => item.value === option.value) || lateRegister.some(item => item.value === option.value)))

    //Post Select dropdown changes to the backend
    const updateLiveAttendance = (e) => {
        let attendees = e.map(x => x.value)
        let lateAttendees = lateRegister.map(x => x.value)
        axios.post('/meetings/register-attendance', {meetingID: meeting.id, attendees: attendees, lateAttendees: lateAttendees})
    }

    const updateLateAttendance = (e) => {
        let attendees = register.map(x => x.value)
        let lateAttendees = e.map(x => x.value)
        axios.post('/meetings/register-attendance', {meetingID: meeting.id, attendees: attendees, lateAttendees: lateAttendees})
    }

    const updateGuestAttendance = (e) => {
        axios.post('/meetings/register-guests', {meetingID: meeting.id, guests: e.map(x => x.value)})
    }

    useEffect(() => {
        //Join websocket channel and listen for updates. Update on event changes.
        Echo.private(`meeting-register`)
            .listen('AttendanceUpdated', (e) => {
                updateRegister(e.punctualAttendees.map(x => ({
                    value: x.user_id,
                    label: x.name
                })))

                updateLateRegister(e.lateAttendees.map(x => ({
                    value: x.user_id,
                    label: x.name
                })))
            })
            .listen('GuestListUpdated', (e) => {
                updateGuests(e.guestList.map(x => ({
                    value: x.name,
                    label: x.name
                })))
            })
        return function cleanup() {
            Echo.leaveChannel('meeting-register')
        }
    }, [])

    return (
        <>
            <div className="grid grid-cols-4 w-full gap-2">
                <div className="lg:col-start-2 lg:col-end-4 col-start-1 col-end-5"> Attending
                    <Select
                        isMulti
                        name="attendance"
                        options={notInAttendance}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        closeMenuOnSelect={false}
						value={register}
                        noOptionsMessage={() => null}
                        onChange={(e) => {updateLiveAttendance(e); updateRegister([...e])}}
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
						value={lateRegister}
                        noOptionsMessage={() => "Everyone is in attendance"}
                        onChange={(e) => {updateLateAttendance(e); updateLateRegister([...e])}}
                    />
                </div>

                <div className="col-start-3 lg:col-end-4 col-end-5">
                    <CreatableSelect
                        isMulti
                        placeholder="Guests"
                        noOptionsMessage={() => "Type to add Guest"}
						value={guests}
                        onChange={(e) => {updateGuests([...e]); updateGuestAttendance(e)}}
                    />
                </div>
            </div>
		</>
	)
}
