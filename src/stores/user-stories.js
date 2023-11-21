import { defineStore } from "pinia";
import { toIsoStringWithTimezone } from "@/lib/utils.js";
import { getJiraIssue } from "@/lib/api.js";

// user story status: ready, queued, processing, success, error
export const useUserStoriesStore = defineStore("user-stories", {
	state: () => ({
		items: {
			"SLS-8040": {
				title:
					"As Teacher, given a Question with Speech Evaluation (SE) component in a Teacher Release Quiz, only allowed to mark my student's responses after the external Speech Evaluation engine has provided marks recommendations",
				content: "",
				status: "processing",
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
				status: "queued",
				infoMessages: [],
			},
		},
	}),
	actions: {
		addItem(key, title, content) {
			this.items[key] = { title, content, status: "ready", infoMessages: [] };
		},
		removeItem(key) {
			delete this.items[key];
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
		setItemAsProcessing(key) {
			this.items[key].status = "processing";
		},
		setItemAsDone(key) {
			this.items[key].status = "done";
		},
		addInfoMessageToItem(key, type, title, description) {
			this.items[key].infoMessages.push({
				type,
				title,
				description,
				date: toIsoStringWithTimezone(new Date()),
			});
		},
	},
});
