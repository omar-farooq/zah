<script setup>
const ClickOutside = {
    updated: (el, binding) => {
        el.clickOutsideEvent = event => {
            if (!(el == event.target || el.contains(event.target)) && binding.value == false) {
                //isHidden.value = true;
				console.log(binding.value)
            }
        };

        document.addEventListener("click", el.clickOutsideEvent);
    },

    unmounted: (el, binding) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    }
};
</script>
