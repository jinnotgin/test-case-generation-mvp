<script setup>
import { computed } from "vue";
import { STORY_STATUS } from "@/lib/constants.js";
const props = defineProps(["title", "status", "storyId", "active"]);

const statusClass = computed(() => {
	let output = "";
	switch (props.status) {
		case STORY_STATUS.DONE:
			output = "bg-green-600";
			break;
		case STORY_STATUS.PROCESSING:
			output = "bg-blue-600";
			break;
		case STORY_STATUS.QUEUED:
			output = "bg-gray-600";
			break;
		case STORY_STATUS.ERROR:
			output = "bg-red-600";
			break;
		default:
			output = "bg-gray-600";
			break;
	}
	return output;
});
</script>

<template>
	<div
		class="px-5 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 cursor-pointer hover:shadow-lg"
		:class="{ 'inset-outline shadow-blue-400': props.active }"
	>
		<div class="flex items-center justify-between">
			<span class="text-md font-bold text-gray-700 dark:text-white">{{
				storyId
			}}</span>
			<div
				class="px-3 py-1 text-xs font-bold text-gray-100 transition-colors duration-300 transform rounded capitalize"
				:class="statusClass"
			>
				{{ status }}
			</div>
		</div>

		<div class="mt-2">
			<p
				class="mt-2 text-md text-gray-600 dark:text-gray-300 line-clamp-3"
				:title="title"
			>
				{{ title }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.inset-outline {
	box-shadow: inset 0 0 0 2px #3b82f6; /* Adjust the color and size as needed */
}
</style>
