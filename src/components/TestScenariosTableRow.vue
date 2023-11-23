<script setup>
import { computed } from "vue";
import VueFeather from "vue-feather";
import { useTestScenariosStore } from "@/stores/test-scenarios";
import { JIRA_ISSUE_URL, TEST_SCENARIO_STATUS } from "@/lib/constants.js";
const props = defineProps({
	userStoryId: String,
	testId: String,
	title: String,
	description: String,
	status: String,
	jiraTestId: String,
	editing: Boolean,
	checked: Boolean,
});

const store = useTestScenariosStore();
const testCaseData = store.items[props.testId];

const titleValue = computed({
	get: () => testCaseData.title,
	set: (value) => store.setItemTitle(props.testId, value),
});
const descriptionValue = computed({
	get: () => testCaseData.description,
	set: (value) =>
		store.setItemDescription(props.testId, value),
});

const emit = defineEmits([
	"start-edit",
	"end-edit",
	"select",
	"deselect",
	"delete",
]);
function handleStartEdit() {
	if (props.status !== TEST_SCENARIO_STATUS.DRAFT) return false;
	emit("start-edit", props.testId);
}
function handleEndEdit() {
	emit("end-edit", props.testId);
}
function handleSelectClick(e) {
	const isChecked = e.target.checked;
	if (isChecked) emit("select", props.testId);
	else emit("deselect", props.testId);
}
function handleDelete() {
	emit("delete", props.testId);
}

const currentJiraIssueUrl = computed(() => {
	return JIRA_ISSUE_URL.replace("{0}", props.jiraTestId);
});
</script>

<template>
	<tr class="align-top" @dblclick="handleEndEdit">
		<td class="px-4 py-3">
			<div class="inline-flex items-center gap-x-3">
				<input
					type="checkbox"
					class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
					:checked="checked"
					@click="handleSelectClick"
				/>
			</div>
		</td>
		<td class="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
			<textarea
				v-if="editing"
				v-model="titleValue"
				class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
				rows="5"
				placeholder="Title"
				>{{ title }}</textarea
			>
			<p v-else class="whitespace-pre-line" @dblclick.stop="handleStartEdit">
				{{ title }}
			</p>
		</td>
		<td
			class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
		>
			<div
				class="whitespace-pre-line flex flex-col gap-2 list-none"
				@dblclick.stop="handleStartEdit"
			>
				<textarea
					v-if="editing"
					v-model="descriptionValue"
					class="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
					rows="15"
					placeholder="Description"
					>{{ description }}</textarea
				>
				<p v-else>{{ description }}</p>
			</div>
		</td>
		<td
			class="px-12 py-3 text-sm text-gray-700 whitespace-nowrap"
		>
			<div
				v-if="status === TEST_SCENARIO_STATUS.DRAFT"
				class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-blue-100/60 dark:bg-gray-800"
			>
				<h2 class="text-sm font-normal text-blue-500 capitalize">
					{{ status }}
				</h2>
			</div>
			<div
				v-else-if="status === TEST_SCENARIO_STATUS.PROCESSING"
				class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100/60 dark:bg-gray-800"
			>
				<h2 class="text-sm font-normal text-yellow-600 capitalize">
					{{ status }}
				</h2>
			</div>
			<div
				v-else-if="status === TEST_SCENARIO_STATUS.PUBLISHED"
				class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800"
			>
				<h2 class="text-sm font-normal text-emerald-500 capitalize">
					{{ status }}
				</h2>
			</div>
		</td>
		<td class="px-4 py-4 whitespace-nowrap">
			<div v-if="status !== TEST_SCENARIO_STATUS.PUBLISHED" class="flex items-center justify-end gap-x-6">
				<button
					class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
					@click="handleDelete"
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
			<a
				v-else
				class="text-xs align-top"
				:href="currentJiraIssueUrl"
				>{{ jiraTestId }}</a
			>
		</td>
	</tr>
</template>
