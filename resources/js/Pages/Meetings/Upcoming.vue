<script setup>
	import { ref, reactive, computed } from "vue";

	const props = defineProps ({
		upcoming: String,
		id: Number,
		memberships: Array,
	})

	const today = new Date()
	const daysFromNow = ref(0);

	const fourWeeks = reactive(Array(28).fill().map((_, i) => new Date(today).setDate(today.getDate() + i)))

	const sevenDays = computed(() => {
			return fourWeeks.slice(0,7);
	})
	
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
				<th v-for="membership in memberships">
					{{ membership.user.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="date in sevenDays">
				<th>
					{{ date }}
				</th>
				<td v-for="membership in memberships">{{ membership.user.id }}</td>
			</tr>
		</tbody>
	</table>
	</div>


</template>
