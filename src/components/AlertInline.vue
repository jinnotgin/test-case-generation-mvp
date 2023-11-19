<script setup>
import { computed } from "vue";
import { formatDate } from "@/lib/utils.js";
const props = defineProps(["type", "title", "description", "date"]);

const iconClassString = computed(() => {
	let output = "";
	switch (props.type) {
		case "info":
			output = "bg-blue-500";
			break;
		case "warning":
			output = "bg-yellow-500";
			break;
		case "success":
			output = "bg-emerald-500";
			break;
		case "error":
			output = "bg-red-500";
			break;
		default:
	}
	return output;
});

const titleClassString = computed(() => {
	let output = "";
	switch (props.type) {
		case "info":
			output = "text-blue-500 dark:text-blue-400";
			break;
		case "warning":
			output = "text-yellow-500 dark:text-yellow-400";
			break;
		case "success":
			output = "text-emerald-500 dark:text-emerald-400";
			break;
		case "error":
			output = "text-red-500 dark:text-red-400";
			break;
		default:
	}
	return output;
});
</script>

<template>
	<div class="flex w-full bg-white shadow-md dark:bg-gray-800">
		<div class="flex items-center justify-center w-12" :class="iconClassString">
			<svg
				class="w-6 h-6 text-white fill-current"
				viewBox="0 0 40 40"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					v-if="props.type === 'info' || props.type === 'warning'"
					d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
				/>
				<path
					v-else-if="props.type === 'success'"
					d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
				/>
				<path
					v-else-if="props.type === 'error'"
					d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
				/>
			</svg>
		</div>

		<div class="px-4 py-2 -mx-3 w-full">
			<div class="mx-3 flex justify-between">
				<div class="">
					<span class="font-semibold" :class="titleClassString">{{
						title
					}}</span>
					<p class="text-sm text-gray-600 dark:text-gray-200">
						{{ description }}
					</p>
				</div>
				<div class="w-30 flex-shrink-0">
					<span class="font-light italic text-xs">{{
						formatDate(new Date(date))
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
