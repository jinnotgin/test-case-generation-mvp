<script setup>
import { ref, computed, watch, nextTick } from "vue";
const props = defineProps({ visible: Boolean });

const modalClassString = computed(() => {
	let output = [];
	output.push(props.visible ? "" : "hidden");

	return output.join(" ");
});

const textInput = ref(null);
const textInputValue = ref("");

watch(
	() => props.visible,
	(newValue, oldValue) => {
		if (newValue) {
			nextTick(() => {
				textInput.value.focus();
			});
		}
	}
);

const emit = defineEmits(["close-modal", "add-stories"]);
function handleCloseModal() {
	emit("close-modal");
}
function handleSubmit() {
	const inputString = textInputValue.value;

	const regex = /SLS-\d+/g;
	let matches = inputString.match(regex);
	if (matches === null) matches = [];

	console.log("Found instances:", matches);
	emit("add-stories", matches);
	emit("close-modal");
	textInputValue.value = "";
}
</script>

<template>
	<div
		id="authentication-modal"
		tabindex="-1"
		aria-hidden="true"
		:class="modalClassString"
		class="overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full"
	>
		<div class="relative p-4 w-full max-w-md max-h-full">
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
				<!-- Modal header -->
				<div
					class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
				>
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						Add User Stories
					</h3>
					<button
						type="button"
						class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-hide="authentication-modal"
						@click="handleCloseModal"
					>
						<svg
							class="w-3 h-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
							/>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				<div class="p-4 md:p-5">
					<form class="space-y-4" @submit.prevent="handleSubmit">
						<div>
							<label
								for="description"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>User Story IDs</label
							>
							<textarea
								id="description"
								rows="4"
								class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter the user story IDs here"
								ref="textInput"
								v-model="textInputValue"
							></textarea>
						</div>
						<button
							type="submit"
							class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Confirm
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
