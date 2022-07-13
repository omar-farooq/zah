<script setup>
import NavbarLink from './NavbarLink.vue';

defineProps(['items','isHidden']);
</script>

<template>
     <div id="dropdown-menu" :class="{ hidden: isHidden }" class="absolute border">
         <li v-for="item in items" class="list-none w-32 h-8">
             <NavbarLink>{{ item }}</NavbarLink>
         </li>
     </div>
</template>
