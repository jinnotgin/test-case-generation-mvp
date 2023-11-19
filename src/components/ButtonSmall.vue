<script setup>
const props = defineProps({ color: String, text: String, disabled: Boolean });
let buttonClass = "";
switch (props.color) {
	case "secondary":
		buttonClass =
			"text-gray-600 bg-white dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100";
		break;
	default:
		buttonClass = "text-white bg-blue-600 hover:bg-blue-500";
		break;
}
if (props.disabled)
	buttonClass = `${buttonClass} opacity-25 hover:cursor-not-allowed`;
</script>

<template>
	<button
		class="px-3 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
		:class="buttonClass"
		:disabled="disabled"
	>
		{{ text }}
	</button>
</template>
