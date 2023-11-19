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
		addItem(key, description, conditions, steps, result) {
			if (!Object.keys(this.items).includes(key)) this.items[key] = {};
			this.items[key].push({
				id: Date.now(),
				description,
				conditions,
				steps,
				result,
				status: "draft",
			});
		},
		setItemAsConfirmed(key, id) {
			this.items[key][id].status = "confirmed";
		},
	},
});
