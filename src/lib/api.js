const BASE_URL = "http://localhost:8080/apis";
const ENDPOINTS = {
	GET_JIRA_ISSUE: "/jira/fetch/issue",
	ADD_JOB: "/add/issue",
	GET_JOB_STATUS: "/fetch/generation-job-status/{uuid}",
	GET_JOB_OUTPUT: "/fetch/test-scenarios/{uuid}",
	UPDATE_TEST: "/update/test-scenarios/{uuid}",
	CREATE_JIRA_TESTS_BULK: "/jira/create/issues",
	ASK_USER_GUIDE: "/dialogflow/message",
	ASK_SEARCH_JIRA_STORIES: "/discovery-engine/conversational-search",
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
		const response = await fetch(url(ENDPOINTS.ADD_JOB, { issueId }), {
			method: "POST",
		});
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
			content: data.description,
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

		const { status = null, lastAction = null, messages = [] } = data;

		return { status, lastAction, messages };
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
		const { data = [] } = json;
		if (!data) throw new Error("Invalid response");
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateTest(testId, title, description) {
	try {
		const payload = {
			title,
			description,
		};
		const response = await fetch(
			url(ENDPOINTS.UPDATE_TEST.replace("{uuid}", testId)),
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { code, data } = await response.json();

		return code === "ok";
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function publishJiraTestsBulk(testIdsArray = []) {
	try {
		const payload = {
			testScenarioUuids: testIdsArray,
		};
		const response = await fetch(url(ENDPOINTS.CREATE_JIRA_TESTS_BULK), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const {
			data: { testId = [] },
		} = await response.json();

		return testId;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function askUserGuide(message) {
	try {
		const response = await fetch(url(ENDPOINTS.ASK_USER_GUIDE), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data = null } = await response.json();
		if (!data) throw new Error("Network response was not ok");

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function askSearchJiraStories(message) {
	try {
		const response = await fetch(url(ENDPOINTS.ASK_SEARCH_JIRA_STORIES), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data = null } = await response.json();
		if (!data) throw new Error("Network response was not ok");

		return data;
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
