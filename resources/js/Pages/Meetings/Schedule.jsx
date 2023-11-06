import { useState, Fragment, useReducer } from 'react'
import { Alert } from '@mantine/core'
import { notifications } from '@mantine/notifications';
import { DateTimeToUKLocale, LongDateFormat, LongDateTimeFormat } from '@/Shared/Functions'
import { ErrorNotification } from '@/Components/Notifications'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/Components/Modal'
import ButtonColoured from '@/Components/ButtonColoured'

export default function Schedule(props) {
    
    //handle the modal open/close state
    const [modalOpenState, setModalOpenState] = useState('false')

    //reducer to handle schedule state
    const initialSchedule = {
        allAvailability: props.schedule,
        overwriteSelected: [],
        scheduledSelected: [],
        selectedDay: '',
        upcomingMeeting: props.upcomingDate,
        userSuggestions: props.members.reduce((a,b) => {
            if(b.id == props.currentUser.id) {
                return [b.schedule_suggestions][0]
            } else {
                return [...a]
            }
        },[]),
        week: 0,
    }

    function reducer(scheduleState, action) {
        switch (action.type) {
            case 'selectAvailability':
                if(scheduleState.allAvailability.find(({date, user_id}) => date == DateTimeToUKLocale(action.day) && user_id == props.currentUser.id)) {
                    if(scheduleState.overwriteSelected.find(val => val == action.day)) {
                        return {...scheduleState, overwriteSelected: scheduleState.overwriteSelected.filter(item => item != action.day)}
                    } else {
                        return {...scheduleState, overwriteSelected: [...scheduleState.overwriteSelected, action.day]}
                    }
                } else {
                    if(scheduleState.scheduledSelected.find(val => val == action.day)) {
                        return {...scheduleState, scheduledSelected: scheduleState.scheduledSelected.filter(item => item != action.day)}
                    } else {
                        return {...scheduleState, scheduledSelected: [...scheduleState.scheduledSelected, action.day]}
                    }
                }

            case 'cancelSelection':
                return {...scheduleState, overwriteSelected: [], scheduledSelected: []}

            case 'changeAvailability':
                return {
                    ...scheduleState,
                    allAvailability: action.allAvailability,
                    overwriteSelected: [],
                    scheduledSelected: []
                }

            case 'selectDayForMeeting':
                return {...scheduleState, selectedDay: action.selectedDay}

            case 'selectWeekToDisplay':
                return {...scheduleState, week: action.selectedWeek}

            case 'setNewUpcomingMeeting':
                return {...scheduleState, upcomingMeeting: action.datetime}

            case 'addSuggestion':
                return {...scheduleState, userSuggestions: [...scheduleState.userSuggestions, action.newSuggestion]}

            case 'deleteSuggestion':
                return {...scheduleState, userSuggestions: scheduleState.userSuggestions.filter(x => x.id != action.suggestionID)}

            default:
                throw new Error();
        }
    }

    const [schedule, dispatch] = useReducer(reducer, initialSchedule)


    const openModal = (e) => setSelectedDay(e.target.textContent)

    const sevenDays = () => {
        const fourWeeks = Array(35).fill().map((_, i) => LongDateFormat(new Date().setDate(new Date().getDate() + i)))
        return fourWeeks.slice(parseInt(schedule.week),parseInt(schedule.week) + 7)
    }

    //function to display availability
    const available = (day, uid) => {
        let arr = schedule.allAvailability.filter(x => x.user_id == uid && x.date == DateTimeToUKLocale(day))
        return arr.map(({availability}) => availability)[0]
    }

    //Also display availability that's not no, yes or maybe
    const customAvailability = (day, uid) => {
        let arr = schedule.allAvailability.filter(x => x.user_id == uid && x.date == DateTimeToUKLocale(day))
        const allUserAvailability = arr.map(({availability}) => availability)[0]
        return allUserAvailability != 'no' && allUserAvailability != 'yes' && allUserAvailability != 'maybe' ? allUserAvailability : ""
    }

    // Return list of suggesters and their suggestions
    let suggesters = props.members.filter(x => x.id != props.currentUser.id && x.schedule_suggestions.length > 0)
    
    //Determine if this row in the table belongs to the current user
    const currentUserRow = (memberId) => {
        return memberId === props.currentUser.id
    }

    //function to create a meeting
    const createMeeting = async () => {
        let time = document.getElementById('suggest-or-schedule-time').value
        await axios.post('/meetings', {time: new Date(schedule.selectedDay + " " + time)})
        if (new Date(schedule.selectedDay + " " + time) < new Date(schedule.upcomingMeeting) || schedule.upcomingMeeting == 'null'){
            dispatch({type: 'setNewUpcomingMeeting', datetime: schedule.selectedDay + " " + time})
        }
        setModalOpenState('false')
    }

    //axios request to update user availability
    const updateAvailability = async (statedAvailability) => {
        let response = await axios.put('/meetings/schedule/availability/update', {
            addDates: schedule.scheduledSelected,
            updateDates: schedule.overwriteSelected,
            availability: statedAvailability,
        })
        dispatch({type: 'changeAvailability', allAvailability: response.data})
    }

    //Function for axios suggestions
    const makeSuggestion = async () => {
        let time = document.getElementById('suggest-or-schedule-time').value
        try {
            let res = await axios.post('/meetings/schedule/suggestions/add', 
                {suggested_date: new Date(schedule.selectedDay + " " + time), user_id: props.currentUser.id}
            )
            dispatch({type: 'addSuggestion', newSuggestion: {id: res.data.id, suggested_date: LongDateTimeFormat(schedule.selectedDay + " " + time), user_id:props.currentUser.id}})
        } catch (error) {
            setModalOpenState('false')
            return ErrorNotification('Can\'t make suggestion', error)
        }
        setModalOpenState('false')
    }

    const deleteSuggestion = async (suggestionID) => {
        await axios.post('/meetings/schedule/suggestions/delete', {id: suggestionID})
        dispatch({type: 'deleteSuggestion', suggestionID: suggestionID})
    }

    return (
        <Fragment>
        {/*Upcoming Date*/}

        {
        schedule.upcomingMeeting == 'null' 
        ?
            <Alert 
                color="green" 
                title="no upcoming meeting scheduled" 
                className="mt-4"
                variant="outline"
            >
                Arrange a meeting by clicking on one of the dates on the schedule
            </Alert>
        :
            <Alert 
                color="orange" 
                icon={<ExclamationCircleIcon className="h-6 w-6" />}
                title="Meeting scheduled" 
                className="mt-4" 
            >
                Upcoming meeting scheduled for {schedule.upcomingMeeting}
            </Alert>
        }

        {/* Dropdown */}
            <div className="mt-4 sm:max-w-none p-2 overflow-x-scroll">
                    <select
                        onChange={e => dispatch({type: 'selectWeekToDisplay', selectedWeek: e.currentTarget.value})}
                        className="lg:text-base"
                    >
                        <option value="0">This week</option>
                        <option value="7">Next week</option>
                        <option value="14">Two weeks</option>
                        <option value="21">Three weeks</option>
                        <option value="28">Four weeks</option>
                    </select>

                {/* Schedule */}

                <table className="table-fixed bg-white md:max-w-fit">
                    <thead>
                        <tr className="md:text-base text-sm">
                            <th className="lg:w-48"></th>
                            {props.members.map(member => {
                                return (
                                    <th key={member.id} className="w-32">
                                        {member.name}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                    
                    {sevenDays().map((day, index) => {
                        return (
                            <tr key={index}>
                                <th className="sm:text-base text-xs lg:h-8">
                                    <button onClick={() => { 
                                        dispatch({type: 'selectDayForMeeting', selectedDay: day}); 
                                        setModalOpenState(!modalOpenState) 
                                    }}>
                                        {day.slice(0,-5)}
                                    </button>
                                </th>
                                
                                {props.members.map(member => {
                                    return (
                                        <td 
                                            key={member.id} 
                                            className={`
                                                border-2
                                                border-black
                                                ${available(day,member.id) === 'yes' && 'bg-green-400'}
                                                ${available(day,member.id) === 'no' && 'bg-red-400'}
                                                ${available(day,member.id) === 'maybe' && 'bg-orange-400'}
                                            `} 
                                            onClick={() => currentUserRow(member.id) ? dispatch({type: 'selectAvailability', day: day}) :''}
                                        >
                                            {customAvailability(day,member.id)}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })} 
                    </tbody>
                </table>
            </div>
            
            

            {/* Div for users updating their schedule*/ }
            {schedule.overwriteSelected.length != 0 || schedule.scheduledSelected.length !=0 
                ?
                    <>
                        {
                            schedule.scheduledSelected.length != 0
                                ?
                                    <>
                                        <div className="font-bold text-lg w-full text-center">Adding availability to the following dates</div>
                                        <div>
                                            {schedule.scheduledSelected.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',',''))).join(', ')}
                                        </div>
                                    </>
                                :
                                    null
                        }
                        {
                            schedule.overwriteSelected.length != 0
                                ?
                                    <>
                                        <div className="font-bold text-lg w-full text-center">Updating the following dates</div>
                                        <div>
                                            {schedule.overwriteSelected.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',',''))).join(', ')}
                                        </div>
                                    </>
                                :
                                    null
                        }
                    <div className="mb-6 flex flex-col flex-wrap justify-center space-y-2 w-3/5 md:flex-row md:space-y-0 md:w-initial">
                
                        {/*available on selected days*/}
                        <ButtonColoured 
                            buttonText="Available" 
                            bgcolour="bg-green-400"
                            hovercolour="hover:bg-green-600"
                            focuscolour="focus:bg-green-700"
                            activecolour="focus:bg-green-800"
                            onclick={ () => updateAvailability('yes')  }
                        />

                        {/*tentaive on selected days*/}
                        <ButtonColoured 
                            buttonText="Tentative" 
                            bgcolour="bg-orange-400"
                            hovercolour="hover:bg-orange-600"
                            focuscolour="focus:bg-orange-700"
                            activecolour="focus:bg-orange-800"
                            onclick={ () => updateAvailability('maybe')  }
                        />

                        {/*unavailable on selected days*/}
                        <ButtonColoured 
                            buttonText="Unavailable" 
                            bgcolour="bg-red-400"
                            hovercolour="hover:bg-red-600"
                            focuscolour="focus:bg-red-700"
                            activecolour="focus:bg-red-800"
                            onclick={ () => updateAvailability('no')  }
                        />

                        {/*Cancel changes*/}
                        <ButtonColoured 
                            buttonText="Cancel" 
                            bgcolour="bg-gray-400"
                            hovercolour="hover:bg-gray-600"
                            focuscolour="focus:bg-gray-700"
                            activecolour="focus:bg-gray-800"
                            onclick={ () => dispatch({type: 'cancelSelection'})  }
                        />

                    </div> 
                    </>
                : 
                    null
            }

            {/* Suggestions */}
            <div>
    
                { suggesters.length > 0
                    ?
                        <>
                            <div className="font-bold text-lg">Suggested dates</div>
                            <ul>
                                {suggesters.map(suggester => {
                                    return(
                                        <li key={suggester.id}>
                                            {suggester.name} has suggested:
                                            <ul>
                                                {suggester.schedule_suggestions.map(suggestedObj => {
                                                    return(
                                                        <li key={suggestedObj.id}>
                                                            {LongDateTimeFormat(suggestedObj.suggested_date)}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                    :
                        null
                            
                }       

                { schedule.userSuggestions.length > 0 
                    ?
                        <>
                            <div className="font-bold text-lg">Your Suggestions</div>
                            <ul>
                                {schedule.userSuggestions.map(suggested => {
                                    return(
                                        <li key={suggested.id}>
                                            {LongDateTimeFormat(suggested.suggested_date)}
                                            <button 
                                                className="ml-2" 
                                                onClick={() => deleteSuggestion(suggested.id)}
                                            >
                                                delete
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                    :
                        null
                }
            </div>

            {/*Modal Component for suggesting or scheduling a date*/}
            <Modal title='Suggest or Schedule date' 
                    buttons={
                        <>
                            <ButtonColoured 
                                buttonText="Suggest" 
                                bgcolour="bg-purple-400"
                                hovercolour="hover:bg-purple-600"
                                focuscolour="focus:bg-purple-700"
                                activecolour="focus:bg-purple-800"
                                onclick={ () => makeSuggestion()}
                            />

                            <ButtonColoured 
                                buttonText="Schedule" 
                                bgcolour="bg-blue-400"
                                hovercolour="hover:bg-blue-600"
                                focuscolour="focus:bg-blue-700"
                                activecolour="focus:bg-blue-800"
                                onclick={ () => createMeeting()}
                            />
                        </>
                    }
                    ModalID='schedule-modal'
                    modalOpenState={modalOpenState}
                    setModalOpenState={setModalOpenState}
            >
                {schedule.selectedDay} <input type="time" className="ml-3" defaultValue="18:30" id="suggest-or-schedule-time"></input> ?
            </Modal>
        </Fragment>
    )
}
