import { defineStore } from "pinia";
import { toIsoStringWithTimezone } from "@/lib/utils.js";
import { getJiraIssue } from "@/lib/api.js";
import { useTestScenariosStore } from "@/stores/test-scenarios.js";
import { STORY_STATUS } from "@/lib/constants.js";

export const useUserStoriesStore = defineStore("user-stories", {
	state: () => ({
		items: {
			"SLS-8040": {
				title:
					"As a user, able to browse Gamified course from cards and table listing",
				content: "",
				status: STORY_STATUS.DONE,
				infoMessages: [
					{
						type: "warning",
						title: "Clarification (Jira User Stories)",
						description: "Generating questions to ask Jira User Stories...",
						date: "2023-11-19T22:30:49+08:00",
					},
					{
						type: "info",
						title:
							"Q: SLS-7874: What is the Game Story preview subpage? What is the purpose of this subpage? What elements are included on this subpage?",
						description:
							"A: The Game Story preview subpage is a subpage in the course editor where teachers can edit the settings for the game story. The settings include the title of the game story, the description, the image, and the conditions that must be met for the game story to be displayed to students.",
						date: "2023-11-19T22:31:47+08:00",
					},
					{
						type: "info",
						title: `Q: SLS-7905: What is the purpose of the "Move Up" and "Move Down" buttons?`,
						description: `A: The "Move Up" and "Move Down" buttons are used to reorder the activities in a lesson.`,
						date: "2023-11-19T22:31:54+08:00",
					},
					{
						type: "warning",
						title: "Clarification (MOE User Guide)",
						description: "Generating questions to ask MOE User Guide...",
						date: "2023-11-19T22:31:59+08:00",
					},
					{
						type: "info",
						title: `Q: What are the steps to create a new game story?`,
						description: `A: To create a new game story, you need to go to the Add Conditions subpage, click Add Conditions and select Game Story. From the left dropdown menu, choose a Game Story. Click Save to proceed.`,
						date: "2023-11-19T22:32:05+08:00",
					},
				],
			},
			"SLS-8698": {
				title:
					"As Teacher, toggle Game Team leaderboard functionality for assignees (ie students) (via Assignment Monitoring - Gamification)",
				content: "",
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			},
			"SLS-7723": {
				title:
					"As Teacher, upon deletion of checkpoint, awarded checkpoints will be deleted in student consumption",
				content: "",
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			},
			"SLS-8788": {
				title:
					"As Teacher, only add up to a maximum of 100 Game Teams per Assignment in an assigned Lesson / Course (Assignment) (Max Limit)",
				content: "",
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			},
		},
		processingQueue: [],
		maxQueueLength: 1, // configurable queue length
	}),
	actions: {
		addItem(key, title, content) {
			this.items[key] = {
				title,
				content,
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			};

			this.addToProcessingQueue();
		},
		async fetchDataforIds(listofIds = []) {
			for (let storyId of listofIds) {
				try {
					const data = await getJiraIssue(storyId);
					const { issueId, title, description } = data;
					if (issueId) this.addItem(issueId, title, description);
				} catch (error) {
					console.error(`Unable to fetch data for ${storyId}`);
				}
			}
		},
		addInfoMessageToItem(key, type, title, description) {
			this.items[key].infoMessages.push({
				type,
				title,
				description,
				date: toIsoStringWithTimezone(new Date()),
			});
		},
		addToProcessingQueue() {
			// Filter out already processing stories
			const processingStories = Object.keys(this.items).filter(
				(key) => this.items[key].status === STORY_STATUS.PROCESSING
			);

			// Calculate available slots in the queue
			const availableSlots = this.maxQueueLength - processingStories.length;
			if (availableSlots <= 0) return false;

			for (let [storyId, storyData] of Object.entries(this.items)) {
				if (this.processingQueue.length >= this.maxQueueLength) break;

				if (storyData.status === STORY_STATUS.QUEUED) {
					// Change the status to processing
					this.items[storyId].status = STORY_STATUS.PROCESSING;
					this.processingQueue.push(storyId);
				}
			}
		},
		processQueuedStories() {
			// TODO: Remove console.log in prod
			console.log("Checking queued items...");
			console.log(this.processingQueue);

			for (let storyId of this.processingQueue) {
				// TODO: Add mechanism here to check for new info messages for all stories being processed
				// add those info messages into the store
				// ---
				// TODO: Add mechanism here to check if the test scenarios are completed generating.
				// if test scenarios generation is completed, add to test scenarios store, remove from the processing queue, and set status to be done

				// for now, we will mock the test scenario data
				this.getGeneratedTestScenarios_fake(storyId);
			}
		},
		async getGeneratedTestScenarios_fake(userStoryId) {
			// assume success and we have the data now
			const response = [
				["Description 123", "Conditions 123", "Steps 123", "Results 123"],
				["Description 456", "Conditions 456", "Steps 456", "Results 456"],
			];

			const testScenariosStore = useTestScenariosStore();

			// Add fake response data to test scenarios store
			for (let item of response) {
				testScenariosStore.addItem(userStoryId, ...item);
			}

			// After processing, change the status (e.g., to 'done') and remove from the queue
			console.log(userStoryId);
			this.items[userStoryId].status = STORY_STATUS.DONE; // Assuming 'done' is a status
			this.processingQueue = this.processingQueue.filter(
				(id) => id !== userStoryId
			);

			// push other items for processing
			this.addToProcessingQueue();
		},
	},
});
