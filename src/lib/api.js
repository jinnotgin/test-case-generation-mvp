const BASE_URL = "http://localhost:8080/apis";
const ENDPOINTS = {
	GET_JIRA_ISSUE: "/jira/fetch/issue",
};
function url(path, params) {
	const queryString = params
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

export async function getJiraIssue(issueId) {
	try {
		const response = await fetch(url(ENDPOINTS.GET_JIRA_ISSUE, { issueId }));
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();

		// Assuming 'data' contains the response as in your example
		// Extract the issue ID, title (summary), and description
		const issueId_response = data.data.key;
		const title = data.data.fields.summary;
		const description = data.data.fields.description;

		return { issueId: issueId_response, title, description };
	} catch (error) {
		console.error(error);
		throw error;
	}
}