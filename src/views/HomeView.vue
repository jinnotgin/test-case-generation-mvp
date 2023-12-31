<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import StoryCard from "@/components/StoryCard.vue";
import TestScenariosTable from "@/components/TestScenariosTable.vue";
import AlertInline from "@/components/AlertInline.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import ModalAddStories from "@/components/ModalAddStories.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";
import LastActionLabel from "@/components/LastActionLabel.vue";
import { JIRA_ISSUE_URL, STORY_STATUS } from "@/lib/constants.js";
import { scrollElementToBottom } from "@/lib/utils.js";

import { useUserStoriesStore } from "@/stores/user-stories";
import { useTestScenariosStore } from "@/stores/test-scenarios";

const userStoriesStore = useUserStoriesStore();
const testScenariosStore = useTestScenariosStore();

const infoMessagesDom = ref(null);
const isMouseInInfoMessagesDom = ref(false);

const userStoriesCount = computed(() => {
	return userStoriesStore && userStoriesStore.items
		? Object.keys(userStoriesStore.items).length
		: 0;
});

const currentUserStoryId = ref(null);

function handleUserStoryClick(key) {
	currentUserStoryId.value = key;
}
const currentUserStoryData = computed(() => {
	return currentUserStoryId && currentUserStoryId.value
		? userStoriesStore.items[currentUserStoryId.value]
		: null;
});
const currentUserStoryInfoMessages = computed(() => {
	return currentUserStoryData.value
		? currentUserStoryData.value.infoMessages
		: [];
});

const currentJiraIssueUrl = computed(() => {
	return JIRA_ISSUE_URL.replace("{0}", currentUserStoryId.value);
});

const modalVisible_addStories = ref(false);
function handleOpenModal() {
	modalVisible_addStories.value = true;
}
function handleCloseModal() {
	modalVisible_addStories.value = false;
}
function handleAddStories(data) {
	console.log(data);
	userStoriesStore.fetchAndAddItems(data);
}

let timeoutId = null;
const startPolling = async () => {
	const POLL_INTERVAL = 5 * 1000;

	const pollFunction = async () => {
		try {
			if (userStoriesStore.processing.length > 0) {
				await userStoriesStore.checkQueuedStories();
				await nextTick();
				if (
					currentUserStoryData.value.status === STORY_STATUS.PROCESSING &&
					!isMouseInInfoMessagesDom.value
				) {
					scrollElementToBottom(infoMessagesDom.value);
				}
			}
			// Schedule the next call after a delay if the function completes successfully
			timeoutId = setTimeout(pollFunction, POLL_INTERVAL); // Poll every 5 seconds
		} catch (error) {
			console.error("An error occurred during polling:", error);
			// Optionally, retry polling after a delay in case of an error
			timeoutId = setTimeout(pollFunction, POLL_INTERVAL);
		}
	};

	pollFunction(); // Start the polling
};

onMounted(startPolling);
onUnmounted(() => {
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
});

// if user switch to view another user story, trigger a info panel force scroll
watch(
	() => currentUserStoryId.value,
	async (newValue, oldValue) => {
		await nextTick();
		if (!isMouseInInfoMessagesDom.value) {
			// only auto scroll to bottom if mouse is outside info messages
			scrollElementToBottom(infoMessagesDom.value);
		}
	}
);

// TODO: Remove this from production (this is only for mock data)
userStoriesStore.shiftToProcessing();
</script>

<template>
	<main class="h-full">
		<splitpanes class="default-theme">
			<pane size="25" min-size="20">
				<section class="p-4 flex flex-col gap-4 h-full overflow-auto">
					<div class="flex justify-between items-center">
						<h3 class="text-xl font-medium text-gray-800 dark:text-white">
							User Stories
						</h3>
						<div class="flex gap-3">
							<ButtonSmall
								v-if="userStoriesCount > 0"
								text="+ Add"
								color="secondary"
								@click="handleOpenModal"
							/>
						</div>
					</div>
					<EmptyPlaceholder
						v-if="userStoriesCount === 0"
						icon="book"
						title="No user stories"
						description="You have not added any user stories yet. Please add some to generate your test scenarios."
					>
						<ButtonSmall
							text="+ Add"
							color="primary"
							@click="handleOpenModal"
						/>
					</EmptyPlaceholder>
					<ul v-else class="list-none flex flex-col gap-2">
						<li
							v-for="({ title, status }, key) in userStoriesStore.items"
							:key="key"
							@click="handleUserStoryClick(key)"
						>
							<StoryCard
								:storyId="key"
								:title="title"
								:status="status"
								:active="currentUserStoryId === key"
							/>
						</li>
					</ul>
				</section>
			</pane>
			<pane size="80" min-size="50">
				<EmptyPlaceholder
					v-if="
						currentUserStoryId === null ||
						!Object.keys(userStoriesStore.items).includes(currentUserStoryId)
					"
					icon="arrow-left"
					title="Click on a user story to begin"
					description=""
				/>
				<splitpanes v-else horizontal>
					<pane size="75" class="flex flex-col pb-4 h-full">
						<div class="w-ful bg-slate-200 mb-4">
							<div
								class="container flex items-center justify-between px-4 py-4 mx-auto"
							>
								<div class="flex">
									<p>
										<a
											:href="currentJiraIssueUrl"
											class="font-bold hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
											target="_blank"
											tabindex="0"
											role="link"
											>{{ currentUserStoryId }}</a
										>: {{ currentUserStoryData.title }}
									</p>
								</div>
							</div>
						</div>
						<TestScenariosTable :userStoryId="currentUserStoryId"
					/></pane>
					<pane size="25" class="flex flex-col gap-2"
						><div
							class="bg-gray-600 text-white px-3 py-2 flex justify-between items-center text-sm"
						>
							<span class="font-bold">Info Panel</span>

							<LastActionLabel
								v-if="currentUserStoryId"
								:status="currentUserStoryData.status"
								:lastAction="currentUserStoryData.lastAction"
							/>
						</div>

						<EmptyPlaceholder
							v-if="currentUserStoryInfoMessages.length === 0"
							icon="info"
							title="Nothing to see here"
							description=""
						/>
						<ul
							class="flex flex-col gap-3 px-3 overflow-auto list-none pb-4"
							ref="infoMessagesDom"
							@mouseenter="isMouseInInfoMessagesDom = true"
							@mouseleave="isMouseInInfoMessagesDom = false"
						>
							<li
								v-for="(
									{ type, title, content, date }, index
								) in currentUserStoryInfoMessages"
							>
								<AlertInline
									:type="type"
									:title="title"
									:description="content"
									:date="date"
								/>
							</li>
						</ul>
					</pane>
				</splitpanes>
			</pane>
		</splitpanes>
		<ModalAddStories
			:visible="modalVisible_addStories"
			@close-modal="handleCloseModal"
			@add-stories="handleAddStories"
		/>
	</main>
</template>
