<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<header class="flex p-2 items-center" style="height: 48px">
		<img alt="Logo" class="logo mx-2" src="@/assets/logo.svg" width="42" />
		<span class="font-bold font-mono logo-text text-md select-none"
			>TestForge AI</span
		>

		<div class="mx-5 h-full border border-slate-300"></div>

		<nav class="flex gap-5">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/chat">Chat</RouterLink>
		</nav>
	</header>

	<main style="height: calc(100svh - 48px)">
		<RouterView />
	</main>
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
