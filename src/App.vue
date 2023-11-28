<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<header class="flex p-2 items-center" style="height: 48px">
		<img alt="Logo" class="logo mx-2" src="@/assets/logo.svg" width="42" />
		<span class="font-bold font-mono logo-text text-md">TestForge AI</span>

		<div class="mx-4 h-full border border-slate-300"></div>

		<nav class="flex gap-4">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/chat">Chat</RouterLink>
		</nav>
	</header>

	<div style="height: calc(100svh - 48px)">
		<RouterView />
	</div>
</template>

<style scoped>
.logo-text {
	color: rgb(28, 46, 64);
}
.router-link-active {
	font-weight: 600;
	color: rgb(28, 46, 64);
}
</style>
