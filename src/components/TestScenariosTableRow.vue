<script setup>
import { computed } from "vue";
import VueFeather from "vue-feather";
import { useTestScenariosStore } from "@/stores/test-cases";
const props = defineProps({
	userStoryId: String,
	testId: String,
	description: String,
	conditions: String,
	steps: String,
	result: String,
	status: String,
	editing: Boolean,
});

const store = useTestScenariosStore();
const testCaseData = store.items[props.userStoryId][props.testId];

const descriptionValue = computed({
	get: () => testCaseData.description,
	set: (value) =>
		store.setItemDescription(props.userStoryId, props.testId, value),
});
const conditionsValue = computed({
	get: () => testCaseData.conditions,
	set: (value) =>
		store.setItemConditions(props.userStoryId, props.testId, value),
});
const stepsValue = computed({
	get: () => testCaseData.steps,
	set: (value) => store.setItemSteps(props.userStoryId, props.testId, value),
});
const resultValue = computed({
	get: () => testCaseData.result,
	set: (value) => store.setItemResult(props.userStoryId, props.testId, value),
});

const emit = defineEmits(["start-edit", "end-edit"]);
function handleStartEdit() {
	emit("start-edit", props.testId);
}
function handleEndEdit() {
	emit("end-edit", props.testId);
}
</script>

<template>
	<tr class="align-top">
		<td class="px-4 py-3">
			<div class="inline-flex items-center gap-x-3">
				<input
					type="checkbox"
					class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
				/>
			</div>
		</td>
		<td class="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
			<textarea
				v-if="editing"
				v-model="descriptionValue"
				class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
				rows="5"
				placeholder="Description"
				>{{ description }}</textarea
			>
			<p v-else class="whitespace-pre-line">
				{{ description }}
			</p>
		</td>
		<td
			class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
		>
			<ul class="whitespace-pre-line flex flex-col gap-2 list-none">
				<li>
					<p class="underline">Pre-Conditions</p>
					<textarea
						v-if="editing"
						v-model="conditionsValue"
						class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
						rows="5"
						placeholder="Conditions"
						>{{ conditions }}</textarea
					>
					<p v-else>{{ conditions }}</p>
				</li>
				<li>
					<p class="underline">Steps</p>
					<textarea
						v-if="editing"
						v-model="stepsValue"
						class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
						rows="5"
						placeholder="Steps"
						>{{ steps }}</textarea
					>
					<p v-else>{{ steps }}</p>
				</li>
				<li>
					<p class="underline">Expected Results</p>
					<textarea
						v-if="editing"
						v-model="resultValue"
						class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
						rows="5"
						placeholder="Expected Result"
						>{{ result }}</textarea
					>
					<p v-else>{{ result }}</p>
				</li>
			</ul>
		</td>
		<td class="px-12 py-3 text-sm text-gray-700 whitespace-nowrap">
			<div
				v-if="status === 'draft'"
				class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-blue-100/60 dark:bg-gray-800"
			>
				<h2 class="text-sm font-normal text-blue-500 capitalize">
					{{ status }}
				</h2>
			</div>
			<div
				v-else-if="status === 'submitted'"
				class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800"
			>
				<h2 class="text-sm font-normal text-emerald-500 capitalize">
					{{ status }}
				</h2>
			</div>
		</td>
		<td class="px-4 py-4 text-sm whitespace-nowrap">
			<div class="flex items-center gap-x-6">
				<button
					class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
				>
					<vue-feather type="trash" size="20" class="w-5 h-5" />
				</button>

				<button
					v-if="editing === false"
					class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
					@click="handleStartEdit"
				>
					<vue-feather type="edit" size="20" class="w-5 h-5" />
				</button>
				<button
					v-if="editing === true"
					class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
					@click="handleEndEdit"
				>
					<vue-feather type="check" size="20" class="w-5 h-5" />
				</button>
			</div>
		</td>
	</tr>
</template>
