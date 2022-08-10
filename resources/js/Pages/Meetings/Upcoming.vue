<script setup>
	import { ref, computed } from "vue"
	import Modal from '@/Components/Modal/Body.vue'
	import ModalButton from '@/Components/Modal/Button.vue'

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
		console.log(currentUser)
		alert(selectedDay + hour + minute)
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

	// Return Schedule Suggestions
	console.log(props.members[0].schedule_suggestions[0].suggested_date)
	let test = () => props.members.filter( 
			x => x.id != props.currentUser.id
		)
		.forEach((member) => { 
			member.schedule_suggestions.forEach((suggestion) => {
			console.log(suggestion.suggested_date)
			})
		})
	test()
	
</script>

<template>

	<div v-if="upcomingDateRef == 'null'">
		No upcoming meeting yet scheduled. 
	</div>

	<div v-else>
		upcoming meeting is {{ upcomingDateRef }}
	</div>


	<div>
	Availability can be seen below:
	<br>
	<select v-model="daysFromNow">
		<option value="0">This week</option>
		<option value="7">Next week</option>
		<option value="14">Two weeks</option>
		<option value="21">Three weeks</option>
	</select>

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
			<tr v-for="day in sevenDays">
				<th>
					<button data-bs-toggle="modal" data-bs-target="#schedule-modal" @click="updateDay($event)">{{ day }}</button>
				</th>
				<td v-for="member in members">{{ available(day,member.id) }}</td>
			</tr>
		</tbody>
	</table>
	</div>

	<!-- Modal Component -->
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

	<!-- Suggestions -->
	

</template>
