<script setup>
import { computed } from "vue";
import Row from "@/components/TestScenariosTableRowView.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";

const props = defineProps(["items"]);
const itemsCount = computed(() => {
	return props.items ? Object.keys(props.items).length : 0;
});
</script>

<template>
	<section class="container px-4 mx-auto">
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
			<ButtonSmall color="primary" text="Submit" disabled />
		</div>

		<EmptyPlaceholder
			v-if="!items || (items && Object.keys(items).length === 0)"
			icon="feather"
			title="No test scenarios"
			description='Please click on "Run" to begin generating test scenarios. This may take a while.'
		/>
		<div v-else class="flex flex-col mt-6">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
											/>
											<span>Description</span>
										</div>
									</th>

									<th
										scope="col"
										class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>
										<button class="flex items-center gap-x-2">
											<span>Pre-Conditions</span>
										</button>
									</th>
									<th
										scope="col"
										class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>
										<button class="flex items-center gap-x-2">
											<span>Steps</span>
										</button>
									</th>

									<th
										scope="col"
										class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>
										Expected Result
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
									:testId="key"
									:description="description"
									:conditions="conditions"
									:steps="steps"
									:result="result"
									:status="status"
								/>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
