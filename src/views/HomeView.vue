<script setup>
import { ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import StoryCard from "../components/StoryCard.vue";
import TestScenariosTable from "../components/TestScenariosTable.vue";
import AlertInline from "../components/AlertInline.vue";
import ButtonSmall from "../components/ButtonSmall.vue";
import ModalAddStories from "../components/ModalAddStories.vue";

import { useUserStoriesStore } from "@/stores/user-stories";
import { useTestScenariosStore } from "@/stores/test-cases";

const userStories = useUserStoriesStore();
const testScenarios = useTestScenariosStore();

const currentUserStory = ref(null);
function handleUserStoryClick(key) {
	console.log("Clicked on", key);
	currentUserStory.value = key;
}

const modalVisible_addStories = ref(false);
function handleOpenModal() {
	modalVisible_addStories.value = true;
}
function handleCloseModal() {
	modalVisible_addStories.value = false;
}
function handleAddStories(data) {
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
				class="flex flex-col gap-4 overflow-auto p-3"
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
						<ButtonSmall text="▶ Run" />
					</div>
				</div>
				<ul class="list-none flex flex-col gap-2">
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
						<div class="overflow-auto flex flex-col gap-3 px-3">
							<AlertInline
								type="warning"
								title="Clarification (Jira User Stories)"
								description="Generating questions to ask Jira User Stories..."
							/>
							<AlertInline
								type="info"
								title="Q: SLS-7874: What is the Game Story preview subpage? What is the purpose of this subpage? What elements are included on this subpage?"
								description="A: The Game Story preview subpage is a subpage in the course editor where teachers can edit the settings for the game story. The settings include the title of the game story, the description, the image, and the conditions that must be met for the game story to be displayed to students."
							/>
							<AlertInline
								type="info"
								title='Q: SLS-7905: What is the purpose of the "Move Up" and "Move Down" buttons?'
								description='A: The "Move Up" and "Move Down" buttons are used to reorder the activities in a lesson.'
							/>
							<AlertInline
								type="warning"
								title="Clarification (MOE User Guide)"
								description="Generating questions to ask MOE User Guide..."
							/>
							<AlertInline
								type="info"
								title="Q: What are the steps to create a new game story?"
								description="A: To create a new game story, you need to go to the Add Conditions subpage, click Add Conditions and select Game Story. From the left dropdown menu, choose a Game Story. Click Save to proceed."
							/>
						</div>
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
