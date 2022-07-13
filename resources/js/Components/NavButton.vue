<script setup>
import { ref } from 'vue';
import NavDropdown from './NavDropdown.vue';

const isHidden = ref(true);

defineProps(['items']);

const vClickOutside = {
	updated: el => {
		el.clickOutsideEvent = event => {
			if (!(el == event.target || el.contains(event.target)) && isHidden.value == false) {
				isHidden.value = true;
			}
		};

		document.addEventListener("click", el.clickOutsideEvent);
	},

	unmounted: (el, binding) => {
		document.removeEventListener("click", el.clickOutsideEvent);
	}
};

</script>


<template>
	<div class="px-6">
	<button @click="isHidden = !isHidden" v-click-outside="isHidden">
		<slot></slot>
	</button>           

	<NavDropdown :items="items" :isHidden="isHidden" />
 
	</div>
</template>
