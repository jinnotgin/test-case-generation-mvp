const BASE_URL = "http://localhost:8080/apis";
const ENDPOINTS = {
	GET_JIRA_ISSUE: "/jira/fetch/issue",
	ADD_JOB: "/add/issue",
	GET_JOB_STATUS: "/fetch/generation-job-status/{uuid}",
	GET_JOB_OUTPUT: "/fetch/test-scenarios/{uuid}",
	CREATE_JIRA_TEST: "/create-jira-test",
};
function url(path, params = {}) {
	const queryString = Object.keys(params).length
		? "?" +
		  Object.entries(params)
				.map(
					([key, value]) =>
						`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
				)
				.join("&")
		: "";

	return `${BASE_URL}${path}${queryString}`;
}

export async function addJob(issueId) {
	try {
		const response = await fetch(url(ENDPOINTS.ADD_JOB, { issueId }));
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const json = await response.json();
		const { data = null } = json;
		if (!data) throw new Error("Invalid response");

		const output = {
			jobId: data.uuid,
			issueId: data.issueId,
			title: data.title,
			content: data.content,
		};

		return output;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getJobStatus(jobId, currentTime = 0) {
	try {
		const response = await fetch(
			url(ENDPOINTS.GET_JOB_STATUS.replace("{uuid}", jobId), { currentTime })
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const json = await response.json();
		const { data = null } = json;
		if (!data) throw new Error("Invalid response");

		const { status = null, messages = [] } = data;

		return { status, messages };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getJobOutput(jobId) {
	try {
		const response = await fetch(
			url(ENDPOINTS.GET_JOB_OUTPUT.replace("{uuid}", jobId))
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const json = await response.json();
		const { data = null } = json;
		if (!data) throw new Error("Invalid response");

		const { generatedTests = [] } = data;

		return { generatedTests };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function createJiraTest(storyId, title, content) {
	try {
		const payload = {
			issueId: storyId,
			title,
			content,
		};
		const response = await fetch(url(ENDPOINTS.CREATE_JIRA_TEST), payload);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		const { status = null, testScenarioId = null } = data;

		return { status, testScenarioId };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// export async function getJiraIssue(issueId) {
// 	try {
// 		const response = await fetch(url(ENDPOINTS.GET_JIRA_ISSUE, { issueId }));
// 		if (!response.ok) {
// 			throw new Error("Network response was not ok");
// 		}
// 		const json = await response.json();
// 		const data = JSON.parse(json.data);

// 		// Extract the issue ID, title (summary), and description
// 		const issueId_response = data.key;
// 		const title = data.fields.summary;
// 		const description = data.fields.description;

// 		return { issueId: issueId_response, title, description };
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// }
