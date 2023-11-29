<script setup>
import { STORY_STATUS } from "@/lib/constants.js";
const props = defineProps(["status", "lastAction"]);
</script>

<template>
	<div v-if="props.status !== STORY_STATUS.QUEUED" class="flex gap-2">
		<span class="font-bold">Activity:</span>
		<div
			:class="{
				'text-red-500': props.status === STORY_STATUS.ERROR,
				'text-green-500': props.status === STORY_STATUS.DONE,
				'text-blue-400 animate-pulse':
					props.status === STORY_STATUS.PROCESSING && props.lastAction === null,
				'text-amber-300 animate-pulse':
					props.status === STORY_STATUS.PROCESSING && props.lastAction !== null,
			}"
		>
			◉
		</div>
		<span>{{ lastAction ? lastAction : "Preparing" }}</span>
	</div>
</template>
