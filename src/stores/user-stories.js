import { defineStore } from "pinia";
import { toIsoStringWithTimezone } from "@/lib/utils.js";
import {
	addJob as api_addJob,
	getJobStatus as api_getJobStatus,
	getJobOutput as api_getJobOutput,
} from "@/lib/api.js";
import { useTestScenariosStore } from "@/stores/test-scenarios.js";
import { STORY_STATUS, API_JOB_STATUS } from "@/lib/constants.js";

export const useUserStoriesStore = defineStore("user-stories", {
	state: () => ({
		items: {
			"SLS-8040": {
				jobId: "sample1",
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
				jobId: "sample2",
				title:
					"As Teacher, toggle Game Team leaderboard functionality for assignees (ie students) (via Assignment Monitoring - Gamification)",
				content: "",
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			},
			"SLS-7723": {
				jobId: "sample3",
				title:
					"As Teacher, upon deletion of checkpoint, awarded checkpoints will be deleted in student consumption",
				content: "",
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			},
			"SLS-8788": {
				jobId: "sample4",
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
		async startProcessing(listofIds = []) {
			for (let storyId of listofIds) {
				try {
					const data = await api_addJob(storyId);
					const { jobId, issueId, title, content } = data;
					if (jobId) this.addItem(issueId, jobId, title, content);
				} catch (error) {
					console.error(`Unable to start a new job for ${storyId}`);
				}
			}
		},
		addItem(itemId, jobId, title, content) {
			this.items[itemId] = {
				jobId,
				title,
				content,
				status: STORY_STATUS.QUEUED,
				infoMessages: [],
			};

			this.shiftToProcessingQueue();
		},
		addInfoMessageToItem(itemId, type, title, description) {
			this.items[itemId].infoMessages.push({
				type,
				title,
				description,
				date: toIsoStringWithTimezone(new Date()),
			});
		},
		shiftToProcessingQueue() {
			// Filter out already processing stories
			const processingStories = Object.keys(this.items).filter(
				(key) => this.items[key].status === STORY_STATUS.PROCESSING
			);

			// Calculate available slots in the queue
			const availableSlots = this.maxQueueLength - processingStories.length;
			if (availableSlots <= 0) return false;

			for (let [storyId, storyData] of Object.entries(this.items)) {
				if (this.processingQueue.length >= this.maxQueueLength) break;

				const { status, jobId } = storyData;

				if (status === STORY_STATUS.QUEUED) {
					// Change the status to processing
					this.items[storyId].status = STORY_STATUS.PROCESSING;
					this.processingQueue.push({ storyId, jobId });
				}
			}
		},
		removeFromProcessingQueue(targetStoryId) {
			this.processingQueue = this.processingQueue.filter(
				({ storyId }) => storyId !== targetStoryId
			);
		},
		async checkQueuedStories() {
			// TODO: Remove console.log in prod
			console.log("Checking queued items...");
			console.log(this.processingQueue);

			for (let { storyId, jobId } of this.processingQueue) {
				// TODO: for now, we will mock the test scenario data. remove in prod.
				this.getGeneratedTestScenarios_fake(storyId);

				const currentTime = Date.now();
				const data = await api_getJobStatus(jobId, currentTime);
				const { status = null, messages } = data;

				if (status === null || status === API_JOB_STATUS.STALLED) {
					this.setItemStatus(STORY_STATUS.ERROR);
					return false;
				}

				for (let messageData of messages) {
					const { type, title, description } = messageData;
					this.addInfoMessageToItem(storyId, type, title, description);
				}

				if (status === API_JOB_STATUS.COMPLETED) {
					const data = api_getJobOutput(jobId);
					const { generatedTestScenarios = [] } = data;

					for (let testScenarioData of generatedTestScenarios) {
						const { title, description } = testScenarioData;
						testScenariosStore.addItem(userStoryId, title, description);
					}

					this.removeFromProcessingQueue(storyId);
					this.shiftToProcessingQueue();
				}
			}
		},
		setItemStatus(itemId, newStatus) {
			this.items[itemId].status = newStatus;
		},
		async getGeneratedTestScenarios_fake(userStoryId) {
			// assume success and we have the data now
			const response = [
				["Description 123", "Conditions 123\n\nSteps 123\n\nResults 123"],
				["Description 123", "Conditions 456\n\nSteps 456\n\nResults 456"],
			];

			const testScenariosStore = useTestScenariosStore();

			// Add fake response data to test scenarios store
			for (let item of response) {
				testScenariosStore.addItem(userStoryId, ...item);
			}

			// After processing, change the status (e.g., to 'done') and remove from the queue
			console.log(userStoryId);
			this.items[userStoryId].status = STORY_STATUS.DONE; // Assuming 'done' is a status
			this.removeFromProcessingQueue(userStoryId);

			// push other items for processing
			this.shiftToProcessingQueue();
		},
	},
});
