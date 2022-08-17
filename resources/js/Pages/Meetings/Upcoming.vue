<script setup>
	import { ref, computed, reactive } from "vue"
	import Modal from '@/Components/Modal/Body.vue'
	import ModalButton from '@/Components/Modal/Button.vue'
	import AxiosButton from '@/Components/AxiosButton.vue'

	const props = defineProps ({
		upcomingDate: String,
		upcomingID: Number,
		members: Array,
		schedule: Array,
		currentUser: Object
	})

	//upcoming date prop made reactive
	const upcomingDateRef = ref(props.upcomingDate)

	// The selected day specified in the modal
	const selectedDay = ref()
	//function to get the text of the day clicked to display in the modal
	const updateDay = (e) => { selectedDay.value = e.target.textContent }

	// Dropdown menu option to select week determines this value (multiples of 7)
	// Used to determine the week shown in the schedule
	const daysFromNow = ref(0)

	// Set date options
	const today = new Date()
	const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

	//Create an array for every day in the next four weeks and fill it.
	// Return the seven days selected from the week dropdown
	const sevenDays = computed(() => {
		const fourWeeks = Array(28).fill().map((_, i) => new Date().setDate(today.getDate() + i)).map(x => new Date(x).toLocaleDateString('en-GB', options))
		return fourWeeks.slice(parseInt(daysFromNow.value),parseInt(daysFromNow.value) + 7)
	})

	// function to display availability
	let available = (day, uid) => {
		let tableDate = new Date(day.replace(',','')).getTime()
		const arr = props.schedule.filter(x => x.user_id == uid && new Date(x.date).getTime() == tableDate)
		return arr.map(({availability}) => availability)[0]
		
	}

	// Function to update the suggestion table
	const makeSuggestion = (selectedDay, currentUser) => { 
		let hour = document.getElementById('hour').value
		let minute = document.getElementById('minute').value
		let proposedNewSuggestion = {
			suggested_date: new Date(selectedDay + " " + hour + ":" + minute).toISOString().replace('T',' ').replace('Z', ''),
			user_id: currentUser
		}
		axios.post('/meetings/schedule/suggestions/add', proposedNewSuggestion)
		.then((response) => {
			authUserScheduleSuggestions.value.push({id: response.data.id, suggested_date: selectedDay, user_id: currentUser.user_id})
		})
	}

	const deleteSuggestion = (deleteSuggestionID) => {
		axios.post('/meetings/schedule/suggestions/delete', {id: deleteSuggestionID})
//		.then((response) => {
			authUserScheduleSuggestions.value = authUserScheduleSuggestions.value.filter(remaining => remaining.id != deleteSuggestionID)
//		}

	}

	// function to create a meeting
	const createMeeting = (selectedDay) => {
		let hour = document.getElementById('hour').value
		let minute = document.getElementById('minute').value
		let timeOfMeeting = new Date(selectedDay.replace(',','') + " " + hour + ":" + minute)
		axios.post('/meetings/create', {time: timeOfMeeting})
		.then((response) => {
			let existingUpcomingDateraw = new Date(upcomingDateRef.value.replace(',',''))
			if (timeOfMeeting < existingUpcomingDateraw || upcomingDateRef.value == 'null') {
				upcomingDateRef.value = new Date(timeOfMeeting).toLocaleDateString('en-GB', options)
			}
		})
		.catch((errors) => {
			console.log(errors)
		})
	}

	// Return list of suggesters and their suggestions
	let suggesters = props.members
		.filter(x => x.id != props.currentUser.id)
		.filter(member => member.schedule_suggestions.length > 0)

	//Reactive current user schedule suggestions
	const authUserScheduleSuggestions = ref(props.members
		.filter(x => x.id == props.currentUser.id)
		.map(user => user.schedule_suggestions)[0])

	// Determine if this row in the table belongs to the current user
	const currentUserRow = (memberId) => {
		return memberId === props.currentUser.id
	}

	// Handle the click event when a user clicks on a row to update their schedule
	const checkedDate = ref([])
	const checkedList = ref([])

	//Handle the click event when availability is already present. Array to update this availability
	const updateCheckedDate = ref([])
	const updateCheckedList = ref([])

	const selectedDateToUpdate = (day, memberId) => {
		if (currentUserRow(memberId)){
			if (props.schedule.find(({date, user_id}) => date == day && user_id == memberId)){
				updateCheckedDate.value.find(val => val === day) ? updateCheckedDate.value = updateCheckedDate.value.filter(item => item !== day) : updateCheckedDate.value.push(day)
				updateCheckedDate.value = updateCheckedDate.value.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',','')))
				updateCheckedList.value = updateCheckedDate.value.join(', ')
			} else {
				checkedDate.value.find(val => val === day) ? checkedDate.value = checkedDate.value.filter(item => item !== day) : checkedDate.value.push(day)
				checkedDate.value = checkedDate.value.sort((a,b) => new Date(a.replace(',','')) - new Date(b.replace(',','')))
				checkedList.value = checkedDate.value.join(', ')

			}
		}	
	}

	//axios requests to update user availability
	const addAvailability = (statedAvailability) => {
		//new availability
		checkedDate.value.forEach(day => props.schedule.push({ availability: statedAvailability, date: day, user_id: props.currentUser.id }))
		//update existing availability
		updateCheckedDate.value.forEach(day => props.schedule.find(({date,user_id}) => date == day && user_id == props.currentUser.id).availability = statedAvailability)

		//set arrays containing selected user schedule dates to empty
		checkedDate.value = []
		checkedList.value = []
		updateCheckedDate.value = []
		updateCheckedList.value = []
	}

</script>

<template>

	<div v-if="upcomingDateRef == 'null'">
		No upcoming meeting yet scheduled. 
	</div>

	<div v-else>
		upcoming meeting is {{ upcomingDateRef }}
	</div>

<!-- Dropdown -->
	<div>
	Availability can be seen below:
	<br>
	<select v-model="daysFromNow">
		<option value="0">This week</option>
		<option value="7">Next week</option>
		<option value="14">Two weeks</option>
		<option value="21">Three weeks</option>
	</select>

	<!-- Schedule -->

	<table class="table-auto">
		<thead>
			<tr>
				<th class="px-8"></th>
				<th v-for="member in members" :key="member.id">
					{{ member.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(day, index) in sevenDays">
				<th>
					<button data-bs-toggle="modal" data-bs-target="#schedule-modal" @click="updateDay($event)">{{ day }}</button>
				</th>
				<td v-for="member in members" :key="member.id" class="border-2" :class="{ 'border-yellow-300': currentUserRow(member.id), 'bg-red-500': available(day,member.id) == 'no' }" @click="selectedDateToUpdate(day,member.id)">
					{{ available(day,member.id) }}
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<!-- div for user updating their schedule -->

	<div v-if="checkedList.length != 0 || updateCheckedList.length != 0">
		<div v-if="checkedList.length != 0">
			Scheduling the following dates:
			<br>
			{{ checkedList }}
		</div>
		<div v-if="updateCheckedList.length !=0">
			Updating the following dates:
			<br>
			{{ updateCheckedList }}
		</div>
		<axios-button class="bg-green-400 hover:bg-green-600 focus:bg-green-700 active:bg-green-800" @axios-response="addAvailability('yes')">Available</axios-button>
		<axios-button class="bg-orange-400 hover:bg-orange-600 focus:bg-orange-700 active:bg-orange-800" @axios-response="addAvailability('maybe')">Tentative</axios-button>
		<axios-button class="bg-red-400 hover:bg-red-600 focus:bg-red-700 active:bg-red-800" @axios-response="addAvailability('no')">Unavailable</axios-button>
	</div>

	<!-- Suggestions -->
	<div>
	Suggested dates
		<div v-if="authUserScheduleSuggestions.length > 0">
			Your suggestions;
			
			<ul>
				<li v-for="mySuggested in authUserScheduleSuggestions" :key="mySuggested.id">
					{{ mySuggested.suggested_date }} <button @click="deleteSuggestion(mySuggested.id)">Delete</button>
				</li>
			</ul>
		</div>
		<ul>
			<li v-for="suggester in suggesters">
				{{suggester.name}} has suggested:
				<ul>
					<li v-for="suggestedObj in suggester.schedule_suggestions" :key="suggestedObj.id">
						{{ suggestedObj.suggested_date }}
					</li>
				</ul>
			</li>
		</ul>
	</div>

	<!-- Modal Component for suggesting or scheduling a date -->
	<modal ModalID="schedule-modal">
		<template #title>
			Suggest or Schedule date
		</template>
		<template #body>
			{{ selectedDay }} 
			<input type="number" id="hour" value="18" class="w-14 appearance-none" style="-moz-appearance: textfield" /> : 
			<input type="number" id="minute" value="30" class="w-14 appearance-none" style="-moz-appearance: textfield" /> ?
		</template>
		<template #buttons>
			<modal-button class="bg-purple-400 hover:bg-purple-600 focus:bg-purple-700 active:bg-purple-800" data-bs-dismiss="modal" @axios-response="makeSuggestion(selectedDay, currentUser.id)">Suggest</modal-button>
			<modal-button class="bg-blue-400 hover:bg-blue-600" data-bs-dismiss="modal" @axios-response="createMeeting(selectedDay)">Schedule</modal-button>
		</template>
	</modal>

</template>
