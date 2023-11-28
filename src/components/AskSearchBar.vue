<script setup>
import { ref } from "vue";
import VueFeather from "vue-feather";

const askSearchQuery = ref("");

const emit = defineEmits(["ask-search"]);
function handleEnter() {
	emit("ask-search", askSearchQuery.value);
}
</script>

<template>
	<div class="relative flex items-center">
		<span class="absolute mt-1.5 ml-3">
			<vue-feather
				type="message-square"
				size="32"
				class="icon w-5 h-5 text-gray-300"
			/>
		</span>

		<input
			type="text"
			placeholder="Ask a new question"
			class="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
			v-model="askSearchQuery"
			@keyup.enter="handleEnter"
		/>
	</div>
</template>
