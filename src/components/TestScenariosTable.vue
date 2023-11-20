<script setup>
import { ref, computed, watch } from "vue";
import Row from "@/components/TestScenariosTableRow.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";
import { useTestScenariosStore } from "@/stores/test-cases";

const props = defineProps(["userStoryId", "items"]);
const itemsCount = computed(() => {
	return props.items ? Object.keys(props.items).length : 0;
});

const store = useTestScenariosStore();

const selected = ref(new Set([]));
function handleSelect(testCaseId) {
	selected.value.add(testCaseId);
}
function handleDeselect(testCaseId) {
	selected.value.delete(testCaseId);
}
const allItemsSelected = computed(() => {
	const testCasesIds = Object.keys(store.items[props.userStoryId]);
	const totalCount = testCasesIds.length;

	const selectedCount = selected.value.size;

	return selectedCount === totalCount;
});
function toggleSelectAll() {
	const testCasesIds = Object.keys(store.items[props.userStoryId]);

	if (allItemsSelected.value) selected.value.clear();
	else {
		for (let id of testCasesIds) handleSelect(id);
	}
}

const beingEdited = ref(new Set([]));
function handleStartEdit(testCaseId) {
	beingEdited.value.add(testCaseId);
}
function handleEndEdit(testCaseId) {
	beingEdited.value.delete(testCaseId);
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
				text="Submit"
				:disabled="selected.size === 0"
			/>
		</div>

		<div
			class="mt-4 h-full"
			v-if="!items || (items && Object.keys(items).length === 0)"
		>
			<EmptyPlaceholder
				icon="feather"
				title="No test scenarios"
				description='Please click on "Run" to begin generating test scenarios. This may take a while.'
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
												:checked="allItemsSelected"
												@click="toggleSelectAll"
											/>
										</div>
									</th>
									<th
										scope="col"
										class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/3"
									>
										<div class="flex items-center gap-x-3">
											<span>Description</span>
										</div>
									</th>

									<th
										scope="col"
										class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/2"
									>
										<button class="flex items-center gap-x-2">
											<span>Details</span>
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
									{ description, conditions, steps, result, status }, key
								) in items"
								:key="key"
							>
								<Row
									:userStoryId="userStoryId"
									:testId="key"
									:description="description"
									:conditions="conditions"
									:steps="steps"
									:result="result"
									:status="status"
									:editing="beingEdited.has(key)"
									:checked="selected.has(key)"
									@start-edit="handleStartEdit"
									@end-edit="handleEndEdit"
									@select="handleSelect"
									@deselect="handleDeselect"
								/>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
