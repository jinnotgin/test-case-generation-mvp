<script setup>
const props = defineProps(['color', 'text'])
const buttonColorClass =
  props.color === 'secondary'
    ? 'text-gray-600 bg-white dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100'
    : ' text-white bg-blue-600 hover:bg-blue-500'
</script>

<template>
  <button
    :class="buttonColorClass"
    class="px-3 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
  >
    {{ text }}
  </button>
</template>
