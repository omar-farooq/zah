<script setup>
	import { ref, computed } from "vue";

	const props = defineProps ({
		upcoming: String,
		id: Number,
		memberships: Array,
		schedule: Array
	})

	const daysFromNow = ref(0);

	const today = new Date();
	const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

	const sevenDays = computed(() => {
		const fourWeeks = Array(28).fill().map((_, i) => new Date().setDate(today.getDate() + i)).map(x => new Date(x).toLocaleDateString('en-GB', options));
		return fourWeeks.slice(parseInt(daysFromNow.value),parseInt(daysFromNow.value) + 7)
	})

	let available = (day, uid) => {
		let tableDate = new Date(day.replace(',','')).getTime()
		const arr = props.schedule.filter(x => x.user_id == uid && new Date(x.date).getTime() == tableDate)
		return arr.map(({availability}) => availability)[0]
		
	}
	
</script>

<template>

	<div v-if="upcoming == 'null'">
		No upcoming meeting yet scheduled. 
	</div>

	<div v-else>
		upcoming meeting is {{ upcoming }}
		<br>Agenda items are as follows:
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
				<th v-for="membership in memberships" :key="membership.user.id">
					{{ membership.user.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="day in sevenDays">
				<th>
					{{ day }}
				</th>
				<td v-for="membership in memberships">{{ available(day,membership.user.id) }}</td>
			</tr>
		</tbody>
	</table>
	</div>


</template>
