<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<header class="flex p-2 items-center" style="height: 48px">
		<img
			alt="Vue logo"
			class="logo mx-2"
			src="@/assets/testcasegen-variant02.png"
			width="42"
		/>

		<nav class="ml-4 flex gap-4">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">Chat</RouterLink>
		</nav>
	</header>

	<div style="height: calc(100svh - 48px)">
		<RouterView />
	</div>
</template>

<style scoped>
.router-link-active {
	font-weight: 600;
	color: rgb(19, 46, 67);
}
</style>
