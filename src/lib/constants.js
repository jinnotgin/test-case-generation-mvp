export const JIRA_ISSUE_URL = "https://jira.sls.ufinity.com/browse/{0}";
export const STORY_STATUS = {
	QUEUED: "queued",
	PROCESSING: "in progress",
	DONE: "done",
	ERROR: "error",
};
export const MESSAGE_TYPE = {
	INFO: "info",
	WARNING: "warning",
	SUCCESS: "success",
	ERROR: "error",
};
export const TEST_SCENARIO_STATUS = {
	DRAFT: "draft",
	PROCESSING: "in progress",
	PUBLISHED: "published",
};
export const API_JOB_STATUS = {
	IDLE: "IDLE",
	PROCESSING: "PROCESSING",
	SUCCESS: "SUCCESS",
	ERROR: "ERROR",
};
export const API_MESSAGE_STATUS = {
	INFO: "INFO",
	WARNING: "WARNING",
	SUCCESS: "SUCCESS",
	ERROR: "ERROR",
};

export const JOB_LAST_ACTION_DISPLAY_NAME = (lastAction) => {
	const mapping = {
		CREATING_PROMPTS: "Clarifying with other Knowledge Sources", // qinkai's backend
		CLARIFYING_CONTEXT: "Clarifying with other Knowledge Sources", // qinkai's backend
		CLARIFYING_STORIES: "Clarifying with other Knowledge Sources", // qinkai's backend
		CLARIFYING: "Clarifying with other Knowledge Sources",
		GENERATING_TEST_SCENARIOS: "Generating Test Scenarios",
		COMPLETED: "Complete",
	};
	if (Object.keys(mapping).includes(lastAction)) return mapping[lastAction];
	else return lastAction;
};
