<script setup>
import { ref, computed, watch } from "vue";
import Row from "@/components/TestScenariosTableRow.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";
import { useTestScenariosStore } from "@/stores/test-scenarios";

const props = defineProps(["userStoryId"]);

const store = useTestScenariosStore();
const items = computed(() => {
	return store.getTestsByStoryId(props.userStoryId);
});
const itemsCount = computed(() => {
	return items.value ? Object.keys(items.value).length : 0;
});

const selected = ref(new Set([]));
function handleSelect(testId) {
	selected.value.add(testId);
}
function handleDeselect(testId) {
	selected.value.delete(testId);
}
const ALL_ITEMS_ARE_SELECTED = computed(() => {
	const testIds = Object.keys(items.value);
	const totalCount = testIds.length;

	const selectedCount = selected.value.size;

	return selectedCount === totalCount;
});
function toggleSelectAll() {
	const testIds = Object.keys(items.value);

	if (ALL_ITEMS_ARE_SELECTED.value) selected.value.clear();
	else {
		for (let id of testIds) handleSelect(id);
	}
}

const beingEdited = ref(new Set([]));
function handleStartEdit(testId) {
	beingEdited.value.add(testId);
}
async function handleEndEdit(testId) {
	await store.syncItemChanges(testId);
	// TODO: at this point, we are intentionally not checking if the above function is successful, as the API endpoint for this may not be ready yet for Demo day.

	if (!store.isSyncing(testId)) beingEdited.value.delete(testId);
}

function handleDelete(testId) {
	const confirmDelete = confirm("Are you sure?");
	if (confirmDelete) store.deleteItem(testId);
}

async function handlePublish() {
	for (let testId of selected.value) {
		await handleEndEdit(testId);
		await store.publishItem(testId);
		handleDeselect(testId);
	}
}

watch(
	() => props.userStoryId,
	(newValue, oldValue) => {
		selected.value.clear();
		beingEdited.value.clear();
	}
);
</script>

<template>
	<section
		class="container px-4 mx-auto h-full flex flex-col overflow-y-auto overflow-x-hidden"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-medium text-gray-800 dark:text-white">
					Generated Test Scenarios
				</h2>

				<span
					class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
					>{{ itemsCount }} items</span
				>
			</div>
			<ButtonSmall
				v-if="itemsCount > 0"
				color="primary"
				text="Publish"
				:disabled="selected.size === 0"
				@click="handlePublish"
			/>
		</div>

		<div
			class="mt-4 h-full"
			v-if="!items || (items && Object.keys(items).length === 0)"
		>
			<EmptyPlaceholder
				icon="feather"
				title="No test scenarios"
				description="Please wait for the test scenarios to be generated. This may take a while."
			/>
		</div>
		<div v-else class="flex flex-col mt-4">
			<div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
					<div
						class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
					>
						<table
							class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
						>
							<thead class="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th
										scope="col"
										class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>
										<div class="flex items-center gap-x-3">
											<input
												type="checkbox"
												class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
												:checked="ALL_ITEMS_ARE_SELECTED"
												@click="toggleSelectAll"
											/>
										</div>
									</th>
									<th
										scope="col"
										class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/3"
									>
										<div class="flex items-center gap-x-3">
											<span>Title</span>
										</div>
									</th>

									<th
										scope="col"
										class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/2"
									>
										<button class="flex items-center gap-x-2">
											<span>Description</span>
										</button>
									</th>
									<th
										scope="col"
										class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>
										<span>Status</span>
									</th>

									<th scope="col" class="relative py-3.5 px-4">
										<span class="sr-only">Edit</span>
									</th>
								</tr>
							</thead>

							<tbody
								class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
								v-for="(
									{ title, description, status, jiraTestId }, key
								) in items"
								:key="key"
							>
								<Row
									:userStoryId="userStoryId"
									:testId="key"
									:title="title"
									:description="description"
									:status="status"
									:jiraTestId="jiraTestId"
									:editing="beingEdited.has(key)"
									:checked="selected.has(key)"
									@start-edit="handleStartEdit"
									@end-edit="handleEndEdit"
									@select="handleSelect"
									@deselect="handleDeselect"
									@delete="handleDelete"
								/>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
