<script setup>
import VueFeather from "vue-feather";
defineProps(["icon", "title", "description"]);
</script>
<template>
	<div
		class="flex items-center text-center border rounded-lg h-full dark:border-gray-700 overflow-hidden"
	>
		<div class="flex flex-col w-full max-w-sm px-4 mx-auto">
			<div
				class="flex p-3 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-800"
			>
				<vue-feather :type="icon" size="24" class="icon w-6 h-6" />
			</div>
			<h1 class="mt-3 text-lg text-gray-800 dark:text-white">
				{{ title }}
			</h1>
			<p class="mt-2 text-gray-500 dark:text-gray-400">
				{{ description }}
			</p>
			<div class="flex items-center mt-4 sm:mx-auto gap-x-3">
				<slot></slot>
			</div>
		</div>
	</div>
</template>
