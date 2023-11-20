<script setup>
const props = defineProps(["title", "status", "storyId", "active"]);
const issueUrl = `https://jira.sls.ufinity.com/browse/${props.storyId}`;
</script>

<template>
	<div
		class="px-5 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 cursor-pointer hover:shadow-lg"
		:class="{ 'inset-outline shadow-blue-400': props.active }"
	>
		<div class="flex items-center justify-between">
			<a
				:href="issueUrl"
				class="text-md font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
				tabindex="0"
				role="link"
				>{{ storyId }}</a
			>
			<a
				class="px-3 py-1 text-xs font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500 capitalize"
				tabindex="0"
				role="button"
				>{{ status }}</a
			>
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
