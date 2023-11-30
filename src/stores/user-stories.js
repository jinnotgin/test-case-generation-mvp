import { defineStore } from "pinia";
import { toIsoStringWithTimezone } from "@/lib/utils.js";
import {
	addJob as api_addJob,
	getJobStatus as api_getJobStatus,
	getJobOutput as api_getJobOutput,
} from "@/lib/api.js";
import { useTestScenariosStore } from "@/stores/test-scenarios.js";
import {
	STORY_STATUS,
	API_JOB_STATUS,
	MESSAGE_TYPE,
	JOB_LAST_ACTION_DISPLAY_NAME,
} from "@/lib/constants.js";

export const useUserStoriesStore = defineStore("user-stories", {
	state: () => ({
		items: {
			// success: SLS-8140, SLS-8453, SLS-7906,  SLS-8041, SLS-8634
			// long: SLS-7907
			// interesting: SLS-8110
			// failure: SLS-8040 (timeout)
			// interesting (making something from nothing): SLS-5423
			// S
		},
		processing: [],
		maxQueueLength: 1, // configurable queue length
	}),
	actions: {
		async fetchAndAddItems(listofIds = []) {
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
			// if we are overwriting an existing user story, clear it from processing
			this.removeFromProcessing(itemId);

			this.items[itemId] = {
				jobId,
				title,
				content,
				status: STORY_STATUS.QUEUED,
				lastAction: null,
				infoMessages: [],
			};

			// if we are over-writing an existing user story, clear out any related test scenarios in the store
			const testScenariosStore = useTestScenariosStore();
			const existingTests = testScenariosStore.getTestsByStoryId(itemId);
			for (let testId of Object.keys(existingTests)) {
				testScenariosStore.deleteItem(testId);
			}

			this.shiftToProcessing();
		},
		addInfoMessageToItem(itemId, type, title, content, date = null) {
			this.items[itemId].infoMessages.push({
				type,
				title,
				content,
				date,
			});
		},
		shiftToProcessing() {
			// Filter out already processing stories
			const processingStories = Object.keys(this.items).filter(
				(key) => this.items[key].status === STORY_STATUS.PROCESSING
			);

			// Calculate available slots in the queue
			const availableSlots = this.maxQueueLength - processingStories.length;
			if (availableSlots <= 0) return false;

			for (let [storyId, storyData] of Object.entries(this.items)) {
				if (this.processing.length >= this.maxQueueLength) break;

				const { status, jobId } = storyData;

				if (status === STORY_STATUS.QUEUED) {
					// Change the status to processing
					this.items[storyId].status = STORY_STATUS.PROCESSING;
					this.processing.push({ storyId, jobId });
				}
			}
		},
		removeFromProcessing(targetStoryId) {
			this.processing = this.processing.filter(
				({ storyId }) => storyId !== targetStoryId
			);
			this.shiftToProcessing();
		},
		async checkQueuedStories() {
			// TODO: Remove console.log in prod
			console.log("Checking queued items...");
			console.log(this.processing);

			for (let { storyId, jobId } of this.processing) {
				// TODO: for now, we will mock the test scenario data. remove in prod.
				// this.getGeneratedTestScenarios_fake(storyId);

				const currentTime = Date.now();
				const data = await api_getJobStatus(jobId, currentTime);
				const { status = null, lastAction = null, messages } = data;

				if (status === null || status === API_JOB_STATUS.ERROR) {
					this.setItemStatus(storyId, STORY_STATUS.ERROR);
					this.removeFromProcessing(storyId);
					return false;
				}

				this.setItemLastAction(storyId, lastAction);

				// TODO: not efficient but works for now until api upgraded to support getting message after a certain time
				this.items[storyId].infoMessages = []; // clear out existing messages

				for (let messageData of messages) {
					const { type, title, description, time, creator } = messageData;

					this.addInfoMessageToItem(
						storyId,
						MESSAGE_TYPE[type],
						title,
						description,
						time
					);
				}

				if (status === API_JOB_STATUS.SUCCESS) {
					const generatedTests = await api_getJobOutput(jobId);

					for (let testData of generatedTests) {
						const { uuid, title, description } = testData;

						const testScenariosStore = useTestScenariosStore();
						testScenariosStore.addItem(uuid, title, description, storyId);
					}

					this.setItemStatus(storyId, STORY_STATUS.DONE);
					this.removeFromProcessing(storyId);
				}
			}
		},
		setItemStatus(itemId, newStatus) {
			this.items[itemId].status = newStatus;
		},
		setItemLastAction(itemId, newLastAction) {
			this.items[itemId].lastAction =
				JOB_LAST_ACTION_DISPLAY_NAME(newLastAction);
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
				const testId = Math.floor(Date.now() * Math.random() * 10);

				testScenariosStore.addItem(testId, ...item, userStoryId);
			}

			// After processing, change the status (e.g., to 'done') and remove from the queue
			console.log(userStoryId);
			this.items[userStoryId].status = STORY_STATUS.DONE; // Assuming 'done' is a status
			this.removeFromProcessing(userStoryId);

			// push other items for processing
			this.shiftToProcessing();
		},
	},
});
