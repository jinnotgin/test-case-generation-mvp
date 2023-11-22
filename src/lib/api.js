const BASE_URL = "http://localhost:8080/apis";
const ENDPOINTS = {
	GET_JIRA_ISSUE: "/jira/fetch/issue",
	ADD_JOB: "/add-job",
	GET_JOB_STATUS: "/get-job-status",
	GET_JOB_OUTPUT: "/get-job-output",
	CREATE_TEST_SCENARIO: "/create-test-scenario",
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
		const data = await response.json();

		const issueId_response = data.key;
		const { jobId = null, title, content } = data;

		return { jobId, issueId: issueId_response, title, content };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getJobStatus(jobId, currentTime = 0) {
	try {
		const response = await fetch(
			url(ENDPOINTS.GET_JOB_STATUS, { jobId, currentTime })
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		const { status = null, messages = [] } = data;

		return { status, messages };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getJobOutput(jobId) {
	try {
		const response = await fetch(url(ENDPOINTS.GET_JOB_OUTPUT, { jobId }));
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		const { generatedTestCases = [] } = data;

		return { generatedTestCases };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function createTestScenario(storyId, title, content) {
	try {
		const payload = {
			issueId: storyId,
			title,
			content,
		};
		const response = await fetch(url(ENDPOINTS.CREATE_TEST_SCENARIO), payload);
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
