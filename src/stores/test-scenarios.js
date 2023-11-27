import { defineStore } from "pinia";
import { TEST_SCENARIO_STATUS } from "@/lib/constants.js";
import {
	updateTest as api_updateTest,
	createJiraTest as api_createJiraTest,
} from "@/lib/api.js";

export const useTestScenariosStore = defineStore("test-scenarios", {
	state: () => ({
		items: {
			// 			1700398085852: {
			// 				title: "Verify that the Game Story tab is displayed when clicked on",
			// 				description: `Pre-Conditions
			// - User is logged in as a Teacher
			// - User is viewing the course editor
			// - User is viewing the gamification settings subpage
			// Steps
			// 1. Click on the Game Story tab
			// Expected Result
			// - The Game Story tab is displayed
			// - The subpage body shows the Game Story tab
			// - Game Story details are shown
			// `,
			// 				status: "published",
			// 				parentStoryId: "SLS-8040",
			// 				jiraTestId: "SLSTESTAI-0000",
			// 			},
			// 			1700398134835: {
			// 				title: "Verify that the Add Game Story button is displayed",
			// 				description: `Pre-Conditions
			// - User is logged in as a Teacher
			// - User is viewing the course editor
			// - User is viewing the gamification settings subpage
			// - User is viewing the Game Story tab
			// Steps
			// 1. Verify that the Add Game Story button is displayed
			// Expected Result
			// - The Add Game Story button is displayed
			// `,
			// 				status: "draft",
			// 				parentStoryId: "SLS-8040",
			// 				jiraTestId: null,
			// 			},
		},
		syncing: new Set([]), // TODO: stub for future effort to sync CRUD with backend
	}),
	getters: {
		getTestsByStoryId: (state) => {
			return (storyId) => {
				// TOOD: consider adding a cache. but with cache, need to invalidate when CRUD happen
				// TODO: another way is to use a Proxy, but thats more complicated
				const relevantItems = Object.entries(state.items).reduce(
					(acc, [testId, testData]) => {
						if (testData.parentStoryId === storyId) {
							acc[testId] = testData;
						}
						return acc;
					},
					{}
				);
				return relevantItems;
			};
		},
		isSyncing: (state) => {
			return (testId) => {
				return state.syncing.has(testId);
			};
		},
	},
	actions: {
		addItem(testId, title, description, storyId) {
			this.items[testId] = {
				id: testId,
				title,
				description,
				status: TEST_SCENARIO_STATUS.DRAFT,
				parentStoryId: storyId,
				jiraTestId: null,
			};
		},
		deleteItem(testId) {
			delete this.items[testId];
		},
		setItemTitle(testId, newValue) {
			this.items[testId].title = newValue;
		},
		setItemDescription(testId, newValue) {
			this.items[testId].description = newValue;
		},
		setItemStatus(testId, newValue) {
			this.items[testId].status = newValue;
		},
		setItemjiraTestId(testId, newValue) {
			this.items[testId].jiraTestId = newValue;
		},
		async syncItemChanges(testId) {
			try {
				this.syncing.add(testId);
				const { title, description } = this.items[testId];
				const result = await api_updateTest(testId, title, description);
				if (result) {
					this.syncing.delete(testId);
				}
			} catch (error) {
				console.error("Error syncing changes for", testId, error);
				this.syncing.delete(testId);
			}
		},
		async publishItem(testId) {
			try {
				const testData = this.items[testId];
				const { title, description, status } = testData;

				if (status !== TEST_SCENARIO_STATUS.DRAFT) return false;

				this.setItemStatus(testId, TEST_SCENARIO_STATUS.PROCESSING);
				const response = await api_createJiraTest(title, description);

				if (response.status && response.testScenarioId) {
					this.setItemStatus(testId, TEST_SCENARIO_STATUS.PUBLISHED);
					this.setItemjiraTestId(testId, response.testScenarioId);
				} else {
					this.setItemStatus(testId, TEST_SCENARIO_STATUS.DRAFT);
				}
			} catch (error) {
				this.setItemStatus(testId, TEST_SCENARIO_STATUS.DRAFT);
				console.error("Error creating test scenario", testId, error);
			}
		},
	},
});
