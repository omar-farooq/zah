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
	const [reactiveSchedule, updateReactiveSchedule] = useState(props.schedule);

	const openModal = (e) => setSelectedDay(e.target.textContent)

	const today = new Date()
	let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

	const sevenDays = () => {
		const fourWeeks = Array(35).fill().map((_, i) => new Date().setDate(today.getDate() + i)).map(x => new Date(x).toLocaleDateString('en-GB', options))
		return fourWeeks.slice(parseInt(week),parseInt(week) + 7)
	}

	//Useful function to convert the formatted date back to the original format in the database
	function parseToDatabaseDate(day) {
		return new Date(day.replace(',','')).toLocaleString('en-GB')
	}

	//function to display availability
	let available = (day, uid) => {
		const arr = reactiveSchedule.filter(x => x.user_id == uid && x.date == parseToDatabaseDate(day))
		return arr.map(({availability}) => availability)[0]
	}

	let customAvailability = (day, uid) => {
		const arr = reactiveSchedule.filter(x => x.user_id == uid && x.date == parseToDatabaseDate(day))
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

	//function to add availability
	const addAvailability = (statedAvailability) => {
		//axios request to insert new availability
		//Don't have to format the day before inserting into the database as Carbon handles that
		if(emptyAvailability.length > 0) {
			emptyAvailability.forEach(day =>
				axios.post('/meetings/schedule/availability/add', {date: day, user_id: props.currentUser.id, availability: statedAvailability})
				.then(() => {
					emptyAvailability.forEach(
						day => updateReactiveSchedule([...reactiveSchedule,{ availability: statedAvailability, date: parseToDatabaseDate(day), user_id: props.currentUser.id}]) 
					)
				})
			)
		}
		//axios request to update user availability
		if(nonEmptyAvailability.length > 0) {
			nonEmptyAvailability.forEach(day =>
				console.log('to be sorted')
//				axios.post('/meetings/schedule/availability/i
			)
		}

		setNewAvailability([])
		setUpdateAvailability([])
	}

	return (
		// Dropdown
		<Fragment>
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
									<button onClick={() => { setSelectedDay(day);setModalOpenState(!modalOpenState) }}>{day}</button>
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
													reactiveSchedule.find(({date, user_id}) => date == parseToDatabaseDate(day) && user_id == member.id)
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
					buttonColour="green" 
					onclick={ () => addAvailability('yes')  }
				/>

				{/*tentaive on selected days*/}
				<ButtonColoured 
					buttonText="Tentative" 
					buttonColour="orange" 
					onclick={ () => addAvailability('maybe')  }
				/>

				{/*unavailable on selected days*/}
				<ButtonColoured 
					buttonText="Unavailable" 
					buttonColour="red" 
					onclick={ () => addAvailability('no')  }
				/>

				{/*Cancel changes*/}
				<ButtonColoured 
					buttonText="Cancel" 
					buttonColour="gray" 
					onclick={ () => {setNewAvailability([]); setUpdateAvailability([])} }
				/>

				</div> 
				: null
			}

			{/* Suggestions */}
			<div>
				Suggested dates
				{ authUserScheduleSuggestions > 0 
				?
					Your Suggestions
						<ul>
							{authUserScheduleSuggestions.map(suggested => {
								return(
									<li key={suggested.id}>
										{suggested.suggested_date}
										<button>delete</button>
									</li>
								)
							})}
						</ul>
				:
					null
				}
			</div>

			{/*Modal Component for suggesting or scheduling a date*/}
			<Modal title='Suggest or Schedule date' 
					buttons={
						<>
							<ButtonColoured buttonText="Suggest" buttonColour="purple" />
							<ButtonColoured buttonText="Schedule" buttonColour="blue" />
						</>
					}
					body={selectedDay}
					ModalID='schedule-modal'
					modalOpenState={modalOpenState}
					setModalOpenState={setModalOpenState}
			/>
		</Fragment>
	)
}
