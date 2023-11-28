<script setup>
import { ref } from "vue";
import SearchAskBar from "@/components/SearchAskBar.vue";
import DropdownSelector from "@/components/DropdownSelector.vue";
import SkeletonText from "@/components/SkeletonText.vue";
// defineProps(["icon", "title", "description"]);

const sources = {
	moeUserGuide: "MOE User Guide",
	jiraUserStories: "Jira User Stories",
};
const activeSource = ref(Object.keys(sources)[0]);
function handleSourceChange(newSourceName) {
	activeSource.value = newSourceName;
}

const inProgress = ref(false);
const answer = ref(null);
const searchResults = ref([]);

function handleSearchAsk(searchAskQuery) {
	inProgress.value = true;

	console.log(searchAskQuery);

	setTimeout(() => {
		inProgress.value = false;
	}, 1500);
}
</script>

<template>
	<div class="bg-slate-100 h-full">
		<div class="flex flex-col mx-auto h-full">
			<section class="bg-white mt-1 rounded-b-3xl">
				<div class="container mx-auto py-6 flex items-center gap-2">
					<SearchAskBar class="grow" @search-ask="handleSearchAsk" />
					<DropdownSelector
						:options="sources"
						:selectedValue="activeSource"
						@update:selectedValue="handleSourceChange"
					/>
				</div>
			</section>
			<section class="container mx-auto">
				<SkeletonText v-if="inProgress" class="py-6" />
				<div v-else class=""></div>
			</section>
			<section
				v-if="searchResults.length > 0"
				class="h-20 bg-white mt-1 rounded-t-3xl"
			>
				<div class="container mx-auto">Search Results</div>
			</section>
		</div>
	</div>
</template>

<style></style>
