<script setup>
import { ref, computed } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import StoryCard from "@/components/StoryCard.vue";
import TestScenariosTable from "@/components/TestScenariosTable.vue";
import AlertInline from "@/components/AlertInline.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import ModalAddStories from "@/components/ModalAddStories.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";

import { useUserStoriesStore } from "@/stores/user-stories";
import { useTestScenariosStore } from "@/stores/test-cases";

const userStories = useUserStoriesStore();
const testScenarios = useTestScenariosStore();

const userStoriesCount = computed(() => {
	return userStories && userStories.items
		? Object.keys(userStories.items).length
		: 0;
});

const currentUserStory = ref(null);
if (userStoriesCount.value > 0) {
	currentUserStory.value = Object.keys(userStories.items)[0];
}

function handleUserStoryClick(key) {
	console.log("Clicked on", key);
	currentUserStory.value = key;
}
const currentUserStoryData = computed(() => {
	return currentUserStory && currentUserStory.value
		? userStories.items[currentUserStory.value]
		: null;
});
const currentUserStoryInfoMessages = computed(() => {
	return currentUserStoryData ? currentUserStoryData.value.infoMessages : [];
});

const modalVisible_addStories = ref(false);
function handleOpenModal() {
	modalVisible_addStories.value = true;
}
function handleCloseModal() {
	modalVisible_addStories.value = false;
}
function handleAddStories(data) {
	// TODO
	console.log(data);
}
</script>

<template>
	<main class="h-full">
		<splitpanes class="default-theme">
			<pane
				size="20"
				min-size="20"
				max-size="30"
				class="flex flex-col gap-4 overflow-auto p-4"
			>
				<div class="flex justify-between items-center">
					<h3 class="text-xl font-medium text-gray-800 dark:text-white">
						User Stories
					</h3>
					<div class="flex gap-3">
						<ButtonSmall
							text="+ Add"
							color="secondary"
							@click="handleOpenModal"
						/>
						<ButtonSmall text="▶ Run" :disabled="userStoriesCount === 0" />
					</div>
				</div>
				<EmptyPlaceholder
					v-if="userStoriesCount === 0"
					icon="book"
					title="No user stories"
					description="You have not added any user stories yet. Please add some to generate your test scenarios."
				>
					<ButtonSmall text="+ Add" color="primary" @click="handleOpenModal" />
				</EmptyPlaceholder>
				<ul v-else class="list-none flex flex-col gap-2">
					<li
						v-for="({ title, status }, key) in userStories.items"
						:key="key"
						@click="handleUserStoryClick(key)"
					>
						<StoryCard
							:storyId="key"
							:title="title"
							:status="status"
							:active="currentUserStory === key"
						/>
					</li>
				</ul>
			</pane>
			<pane size="80" min-size="50">
				<splitpanes horizontal>
					<pane size="65" class="overflow-auto py-4"
						><TestScenariosTable
							:items="
								currentUserStory ? testScenarios.items[currentUserStory] : {}
							"
					/></pane>
					<pane size="35" class="flex flex-col gap-2"
						><div
							class="bg-gray-600 text-white px-3 py-2 flex justify-between items-center"
						>
							<span class="text-sm font-bold">Info Panel</span>
						</div>
						<EmptyPlaceholder
							v-if="currentUserStoryInfoMessages.length === 0"
							icon="info"
							title="Nothing to see here"
							description=""
						/>
						<ul class="flex flex-col gap-3 px-3 overflow-auto list-none pb-4">
							<li
								v-for="(
									{ type, title, description, date }, index
								) in currentUserStoryInfoMessages"
							>
								<AlertInline
									:type="type"
									:title="title"
									:description="description"
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
