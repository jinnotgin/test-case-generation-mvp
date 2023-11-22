import { defineStore } from "pinia";
import { TEST_SCENARIO_STATUS } from "@/lib/constants.js";
import { createTestScenario as api_createTestScenario } from "@/lib/api.js";

export const useTestScenariosStore = defineStore("test-scenarios", {
	state: () => ({
		items: {
			"SLS-8040": {
				1700398085852: {
					title: "Verify that the Game Story tab is displayed when clicked on",
					description: `Pre-Conditions
- User is logged in as a Teacher
- User is viewing the course editor
- User is viewing the gamification settings subpage

Steps
1. Click on the Game Story tab

Expected Result
- The Game Story tab is displayed
- The subpage body shows the Game Story tab
- Game Story details are shown
`,
					status: "draft",
					issueId: null,
				},
				1700398134835: {
					title: "Verify that the Add Game Story button is displayed",
					description: `Pre-Conditions
- User is logged in as a Teacher
- User is viewing the course editor
- User is viewing the gamification settings subpage
- User is viewing the Game Story tab

Steps
1. Verify that the Add Game Story button is displayed

Expected Result
- The Add Game Story button is displayed
`,
					status: "draft",
					jiraIssueId: null,
				},
			},
		},
	}),
	actions: {
		addItem(storyId, title, description) {
			if (!Object.keys(this.items).includes(storyId)) this.items[storyId] = {};
			const testId = Math.floor(Date.now() * Math.random() * 10);

			this.items[storyId][testId] = {
				id: testId,
				title,
				description,
				status: TEST_SCENARIO_STATUS.DRAFT,
				jiraIssueId: null,
			};
		},
		deleteItem(storyId, testId) {
			delete this.items[storyId][testId];
		},
		setItemTitle(storyId, testId, newValue) {
			this.items[storyId][testId].title = newValue;
		},
		setItemDescription(storyId, testId, newValue) {
			this.items[storyId][testId].description = newValue;
		},
		setItemStatus(storyId, testId, newValue) {
			this.items[storyId][testId].status = newValue;
		},
		setItemJiraIssueId(storyId, testId, newValue) {
			this.items[storyId][testId].jiraIssueId = newValue;
		},
		async createTestScenario(storyId, testId) {
			try {
				const testData = this.items[storyId][testId];
				const { title, description, status } = testData;

				if (status !== TEST_SCENARIO_STATUS.DRAFT) return false;

				this.setItemStatus(storyId, testId, TEST_SCENARIO_STATUS.PROCESSING);
				const response = await api_createTestScenario(
					storyId,
					title,
					description
				);

				if (response.status && response.testScenarioId) {
					this.setItemStatus(storyId, testId, TEST_SCENARIO_STATUS.SUBMITTED);
					this.setItemJiraIssueId(storyId, testId, response.testScenarioId);
				} else {
					this.setItemStatus(storyId, testId, TEST_SCENARIO_STATUS.DRAFT);
				}
			} catch (error) {
				this.setItemStatus(storyId, testId, TEST_SCENARIO_STATUS.DRAFT);
				console.error("Error creating test scenario", testId, error);
			}
		},
	},
});
