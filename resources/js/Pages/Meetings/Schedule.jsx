import { useState, Fragment, useEffect } from 'react'
import Modal from '@/Components/Modal'
import ButtonColoured from '@/Components/ButtonColoured'

export default function Schedule(props) {
	//hooks
	const [week, setWeek] = useState(0);
	const [authUserScheduleSuggestions, setAuthUserScheduleSuggestions] = useState(props.members
																		  	.filter(x => x.id == props.currentUser.id)
																			.map(user => user.schedule_suggestions)[0]
																		  )
	//selection from the date column
	const [selectedDay, setSelectedDay] = useState('')

	//selection from the user's own column where availability hasn't been set
	const [emptyAvailability, setNewAvailability] = useState([])

	//selection from the user's own column where availability has already been set
	const [nonEmptyAvailability, setUpdateAvailability] = useState([])

	//handle the modal open/close state
	const [modalOpenState, setModalOpenState] = useState('false')

	//make the schedule reactive
	const [reactiveSchedule, updateReactiveSchedule] = useState(props.schedule)

	//Upcoming meeting
	const [upcomingDate, setUpcomingDate] = useState(props.upcomingDate)

	const openModal = (e) => setSelectedDay(e.target.textContent)

	const today = new Date()
	let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

	const sevenDays = () => {
		const fourWeeks = Array(35).fill().map((_, i) => new Date().setDate(today.getDate() + i)).map(x => new Date(x).toLocaleDateString('en-GB', options))
		return fourWeeks.slice(parseInt(week),parseInt(week) + 7)
	}

	//Useful function to convert the formatted date back to the original format in the database
	function parseToLocalDate(day) {
		return new Date(day.replace(',','')).toLocaleString('en-GB')
	}

	//function to display availability
	let available = (day, uid) => {
		const arr = reactiveSchedule.filter(x => x.user_id == uid && x.date == parseToLocalDate(day))
		return arr.map(({availability}) => availability)[0]
	}

	let customAvailability = (day, uid) => {
		const arr = reactiveSchedule.filter(x => x.user_id == uid && x.date == parseToLocalDate(day))
		const allAvailability = arr.map(({availability}) => availability)[0]
		return allAvailability != 'no' && allAvailability != 'yes' && allAvailability != 'maybe' ? allAvailability : ""
	}

	// Return list of suggesters and their suggestions
	let suggesters = props.members
		.filter(x => x.id != props.currentUser.id)
		.filter(member => member.schedule_suggestions.length > 0)
	
	//Determine if this row in the table belongs to the current user
	const currentUserRow = (memberId) => {
		return memberId === props.currentUser.id
	}

	//function to create a meeting
	const createMeeting = () => {
		let hours = document.getElementById('suggest-or-schedule-time').value.split(':')[0]
		let minutes = document.getElementById('suggest-or-schedule-time').value.split(':')[1]
		let UTCTime = (Number(hours - 1)) + ':' + minutes
		let localTime = hours + ':' + minutes
		axios.post('/meetings/create', {time: selectedDay + " " + UTCTime}
		)
		.then((response) => {
			if (new Date(selectedDay + " " + localTime) < new Date(upcomingDate)){
				setUpcomingDate(selectedDay + " " + localTime)
			}
			
		})
		setModalOpenState('false')
	}

	//function to add availability
	//update first as we're making a copy of the schedule and replacing it
	//then add to the new schedule
	async function addAvailability (statedAvailability) {
		updateAvailability(statedAvailability)
		.then(addNewAvailability(statedAvailability))
		.then(resetAvailabilityStates())
	}


		//axios request to insert new availability
		//Don't have to format the day before inserting into the database as Carbon handles that
	const addNewAvailability = (statedAvailability) => {
		return new Promise(() => {
			if(emptyAvailability.length > 0) {
				emptyAvailability.forEach(day =>
				
					axios.post('/meetings/schedule/availability/add', {date: day, user_id: props.currentUser.id, availability: statedAvailability})
					.then((response) => {
							updateReactiveSchedule(reactiveSchedule => [...reactiveSchedule,{ id: response.data.id, availability: statedAvailability, date: parseToLocalDate(day), user_id: props.currentUser.id}])
					})

				)
			}
		})
	}

		//axios request to update user availability
	const updateAvailability = (statedAvailability) => {
		return new Promise(() => {
			if(nonEmptyAvailability.length > 0) {
				nonEmptyAvailability.forEach(day => {
					let newSchedule = [...reactiveSchedule]
					newSchedule.find(obj => { obj.date == parseToLocalDate(day) && obj.user_id == props.currentUser.id 
						? 
							axios.put('/meetings/schedule/availability/update/' + obj.id,{
								availability: statedAvailability,
							})
							.then((response) => {
								obj.availability = statedAvailability
								updateReactiveSchedule(newSchedule)
							})
						:
							null
					})
				})
			}
		})
	}

	function resetAvailabilityStates() {
		setNewAvailability([])
		setUpdateAvailability([])
	}

	//Function for axios suggestions
	const makeSuggestion = () => {
		//convert to UTC time for the database
		let hours = document.getElementById('suggest-or-schedule-time').value.split(':')[0]
		let minutes = document.getElementById('suggest-or-schedule-time').value.split(':')[1]
		let UTCTime = (Number(hours - 1)) + ':' + minutes
		let localTime = hours + ':' + minutes
		axios.post('/meetings/schedule/suggestions/add', 
			{suggested_date: selectedDay + " " + UTCTime, user_id: props.currentUser.id}
		)
		.then((response) =>
			setAuthUserScheduleSuggestions([...authUserScheduleSuggestions,
				{id: response.data.id, suggested_date: selectedDay + " " + localTime, user_id:props.currentUser.id}]
			)
		)
		setModalOpenState('false')
	}

	const deleteSuggestion = (suggestionID) => {
		axios.post('/meetings/schedule/suggestions/delete', {id: suggestionID})
		.then((response) => {
			setAuthUserScheduleSuggestions(authUserScheduleSuggestions.filter(remaining => remaining.id != suggestionID))
		})
	}

	return (
		<Fragment>
		{/*Upcoming Date*/}

		{
		upcomingDate == 'null' 
		?
			<div>no upcoming meeting scheduled</div>
		:
			<div>Next meeting {upcomingDate}</div>
		}

		{/* Dropdown */}
			<div>
				Availability can be seen below:
				<br />
					<select
						onChange={e => setWeek(e.currentTarget.value)}
					>
						<option value="0">This week</option>
						<option value="7">Next week</option>
						<option value="14">Two weeks</option>
						<option value="21">Three weeks</option>
						<option value="28">Four weeks</option>
					</select>

				{/* Schedule */}

				<table className="table-auto">
					<thead>
						<tr>
							<th className="px-8"></th>
							{props.members.map(member => {
								return (
									<th key={member.id}>
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
								<th>
									<button onClick={() => { setSelectedDay(day);setModalOpenState(!modalOpenState) }}>{day.slice(0,-5)}</button>
								</th>
								
								{props.members.map(member => {
									return (
										<td 
											key={member.id} 
											className={`
												border-2 
												${available(day,member.id) === 'yes' && 'bg-green-400'}
												${available(day,member.id) === 'no' && 'bg-red-400'}
												${available(day,member.id) === 'maybe' && 'bg-orange-400'}
											`} 
											onClick={() => currentUserRow(member.id) 
												? 
													reactiveSchedule.find(({date, user_id}) => date == parseToLocalDate(day) && user_id == member.id)
													?
														nonEmptyAvailability.find(val => val == day) 
														? 
															setUpdateAvailability(nonEmptyAvailability.filter(item => item != day))
														: 
															setUpdateAvailability([...nonEmptyAvailability, day])

													:
														emptyAvailability.find(val => val === day) 
														? 
															setNewAvailability(emptyAvailability.filter(item => item != day))
														: 
															setNewAvailability([...emptyAvailability, day])
														
												: 
													null 
											}
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
			{emptyAvailability.length != 0 || nonEmptyAvailability.length !=0 
				? 
				<div>
				{
					emptyAvailability.length != 0
						?
							<div>
								Adding availability to the following dates:
								<br />
								{emptyAvailability.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',',''))).join(', ')}
							</div>
						:
							null
				}
				{
					nonEmptyAvailability.length != 0
						?
							<div>
								Updating the following dates:
								<br />
								{nonEmptyAvailability.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',',''))).join(', ')}
							</div>
						:
							null
				}
				
				{/*available on selected days*/}
				<ButtonColoured 
					buttonText="Available" 
					bgcolour="bg-green-400"
					hovercolour="hover:bg-green-600"
					focuscolour="focus:bg-green-700"
					activecolour="focus:bg-green-800"
					onclick={ () => addAvailability('yes')  }
				/>

				{/*tentaive on selected days*/}
				<ButtonColoured 
					buttonText="Tentative" 
					bgcolour="bg-orange-400"
					hovercolour="hover:bg-orange-600"
					focuscolour="focus:bg-orange-700"
					activecolour="focus:bg-orange-800"
					onclick={ () => addAvailability('maybe')  }
				/>

				{/*unavailable on selected days*/}
				<ButtonColoured 
					buttonText="Unavailable" 
					bgcolour="bg-red-400"
					hovercolour="hover:bg-red-600"
					focuscolour="focus:bg-red-700"
					activecolour="focus:bg-red-800"
					onclick={ () => addAvailability('no')  }
				/>

				{/*Cancel changes*/}
				<ButtonColoured 
					buttonText="Cancel" 
					bgcolour="bg-gray-400"
					hovercolour="hover:bg-gray-600"
					focuscolour="focus:bg-gray-700"
					activecolour="focus:bg-gray-800"
					onclick={ () => {setNewAvailability([]); setUpdateAvailability([])} }
				/>

				</div> 
				: null
			}

			{/* Suggestions */}
			<div>
				Suggested dates
	
				{ suggesters.length > 0
				?
					<ul>
						{suggesters.map(suggester => {
							return(
								<li key={suggester.id}>
									{suggester.name} has suggested:
									<ul>
										{suggester.schedule_suggestions.map(suggestedObj => {
											return(
												<li key={suggestedObj.id}>
													{suggestedObj.suggested_date}
												</li>
											)
										})}
									</ul>
								</li>
							)
						})}
					</ul>
				:
					null
							
				}		

				{ authUserScheduleSuggestions.length > 0 
				?
					<>
					<p>Your Suggestions</p>
						<ul>
							{authUserScheduleSuggestions.map(suggested => {
								return(
									<li key={suggested.id}>
										{parseToLocalDate(suggested.suggested_date)}
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
			{selectedDay} <input type="time" className="ml-3" defaultValue="18:30" id="suggest-or-schedule-time"></input> ?
			</Modal>
		</Fragment>
	)
}
