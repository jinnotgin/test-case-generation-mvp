import { defineStore } from "pinia";

export const useTestScenariosStore = defineStore("test-scenarios", {
	state: () => ({
		items: {
			"SLS-8040": {
				1700398085852: {
					description:
						"Verify that the Game Story tab is displayed when clicked on",
					conditions: `- User is logged in as a Teacher
        - User is viewing the course editor
        - User is viewing the gamification settings subpage`,
					steps: "1. Click on the Game Story tab",
					result: `- The Game Story tab is displayed
          - The subpage body shows the Game Story tab
          - Game Story details are shown`,
					status: "draft",
				},
				1700398134835: {
					description: "Verify that the Add Game Story button is displayed",
					conditions: `- User is logged in as a Teacher
          - User is viewing the course editor
          - User is viewing the gamification settings subpage
          - User is viewing the Game Story tab`,
					steps: "1. Verify that the Add Game Story button is displayed",
					result: `- The Add Game Story button is displayed`,
					status: "draft",
				},
			},
		},
	}),
	actions: {
		addItem(storyId, description, conditions, steps, result) {
			if (!Object.keys(this.items).includes(storyId)) this.items[storyId] = {};
			const testId = Math.floor(Date.now() * Math.random() * 10);
			console.log(testId);
			this.items[storyId][testId] = {
				id: testId,
				description,
				conditions,
				steps,
				result,
				status: "draft",
			};
		},
		deleteItem(storyId, testId) {
			delete this.items[storyId][testId];
		},
		setItemDescription(storyId, testId, newValue) {
			this.items[storyId][testId].description = newValue;
		},
		setItemConditions(storyId, testId, newValue) {
			this.items[storyId][testId].conditions = newValue;
		},
		setItemSteps(storyId, testId, newValue) {
			this.items[storyId][testId].steps = newValue;
		},
		setItemResult(storyId, testId, newValue) {
			this.items[storyId][testId].result = newValue;
		},
		setItemAsConfirmed(storyId, testId) {
			this.items[storyId][testId].status = "confirmed";
		},
	},
});
