<script setup>
import NavButton from "../Components/NavButton.vue";

const meetingItems = ['Summary','Minutes','Upcoming'];
const treasuryItems = ['Summary','Reports'];
const purchaseItems = ['All Purchases', 'Request', 'Pending Approval'];
const maintenanceItems = ['All Maintenance', 'Upcoming', 'Request', 'Pending Approval'];

</script>

<template>

<nav class="container flex bg-white py-8 mx-auto justify-around">
	<div>
		<h3 class="text-2xl font-medium text-blue-500">InProgress</h3>
	</div>
	<div class="flex flex-nowrap">
		<NavButton :items="meetingItems">Meetings</NavButton>
		<NavButton :items="purchaseItems">Purchases</NavButton>
		<NavButton :items="maintenanceItems">Maintenance</NavButton>
		<NavButton :items="treasuryItems">Treasury</NavButton>
	</div>
</nav>

</template>
