<script setup>
import { ref } from "vue";
import AskSearchBar from "@/components/AskSearchBar.vue";
import DropdownSelector from "@/components/DropdownSelector.vue";
import SkeletonText from "@/components/SkeletonText.vue";
import {
	askUserGuide as api_askUserGuide,
	askSearchJiraStories as api_askSearchJiraStories,
} from "@/lib/api.js";
import { stripHtml } from "@/lib/utils.js";
// defineProps(["icon", "title", "description"]);

const sources = {
	moeUserGuide: "MOE User Guide",
	jiraUserStories: "Jira User Stories",
};
const activeSource = ref(Object.keys(sources)[0]);
function handleSourceChange(newSourceName) {
	activeSource.value = newSourceName;
	reply.value = null;
	searchResults.value = [];
}

const inProgress = ref(false);
const reply = ref(null);
const searchResults = ref([]);

const previousAskSearch = {
	askSearchQuery: null,
	activeSource: null,
};
async function handleAskSearch(askSearchQuery) {
	try {
		if (askSearchQuery.trim() === "") return false;
		if (
			previousAskSearch.askSearchQuery === askSearchQuery &&
			previousAskSearch.activeSource === activeSource.value
		) {
			return false;
		}

		inProgress.value = true;
		searchResults.value = [];
		previousAskSearch.askSearchQuery = askSearchQuery;
		previousAskSearch.activeSource = activeSource.value;

		const response = {
			reply: null,
			searchResults: [],
		};
		switch (activeSource.value) {
			case "moeUserGuide":
				response.reply = await api_askUserGuide(askSearchQuery);
				break;
			case "jiraUserStories":
				const { reply = null, searchResults = [] } =
					await api_askSearchJiraStories(askSearchQuery);

				response.reply = reply;
				response.searchResults = searchResults;
				break;
			default:
				console.error("Unknown activeSource", activeSource);
		}
		reply.value = response.reply;
		searchResults.value = response.searchResults;

		inProgress.value = false;
	} catch (error) {
		console.error(error);
		inProgress.value = false;
	}
}
</script>

<template>
	<div class="bg-slate-100 h-full overflow-x-hidden">
		<div class="flex flex-col mx-auto h-full">
			<section class="bg-white mt-1 rounded-b-3xl">
				<div class="container ml-40 py-10 flex items-center gap-4">
					<AskSearchBar class="grow max-w-3xl" @ask-search="handleAskSearch" />
					<DropdownSelector
						:options="sources"
						:selectedValue="activeSource"
						@update:selectedValue="handleSourceChange"
					/>
				</div>
			</section>

			<section class="container ml-40 max-w-3xl">
				<SkeletonText v-if="inProgress" class="py-10" />
				<p v-else class="text-xl py-10 leading-relaxed text-gray-800">
					{{ reply }}
				</p>
			</section>

			<section
				v-if="searchResults.length > 0"
				class="bg-white pt-12 pb-24 rounded-t-3xl"
			>
				<ul class="container ml-40 max-w-3xl flex flex-col gap-10">
					<li
						v-for="(result, index) in searchResults"
						:key="result.link"
						class=""
					>
						<div class="flex gap-2 items-center">
							<span class="text-sm text-gray-500 font-medium"
								>[{{ index + 1 }}]</span
							>
							<a
								:href="result.link"
								target="_blank"
								class="text-xs text-gray-500"
								>{{ result.link }}</a
							>
						</div>
						<a
							class="mt-1 text-gray-800 text-xl font-medium line-clamp-2 hover:underline"
							:href="result.link"
							target="_blank"
							:title="result.title"
						>
							{{ result.title }}
						</a>
						<p class="mt-1 text-sm text-gray-800 line-clamp-1">
							{{ stripHtml(result.snippet) }}
						</p>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style></style>
