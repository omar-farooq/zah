<script setup>
import NavButton from "../Components/NavButton.vue";

const meetingItems = ['meetingitem1','metitem2','meetitem3'];
const treasuryItems = ['treasuryitem1','treasuryitem2','item3'];

</script>

<template>

<nav class="container flex bg-white py-8 mx-auto justify-around">
	<div>
		<h3 class="text-2xl font-medium text-blue-500">InProgress</h3>
	</div>
	<div class="flex flex-nowrap">
		<NavButton :items="meetingItems">Meetings</NavButton>
		<NavButton :items="meetingItems">Purchases</NavButton>
		<NavButton :items="meetingItems">Maintenance</NavButton>
		<NavButton :items="treasuryItems">Treasury</NavButton>
	</div>
</nav>

</template>
