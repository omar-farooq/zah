<script setup>
	import Nav from './Nav.vue'
</script>

<template>
	<Nav />
	<header>
		<slot name="header"></slot>
	</header>
	<main>
		<div class="container mx-auto">
			<slot></slot>
		</div>
	</main>
	<footer>
		<slot name="footer"></slot>
	</footer>
</template>
