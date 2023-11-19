<script setup>
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import StoryCard from '../components/StoryCard.vue'
import TestCasesTable from '../components/TestCasesTable.vue'
import InfoStatus from '../components/InfoStatus.vue'
import ButtonSmall from '../components/ButtonSmall.vue'
import ModalAddStories from '../components/ModalAddStories.vue'

import { useUserStoriesStore } from '../stores/user-stories'
const userStories = useUserStoriesStore()

const modalVisible_addStories = ref(false)
function handleOpenModal() {
  modalVisible_addStories.value = true
}
function handleCloseModal() {
  modalVisible_addStories.value = false
}
function handleAddStories(data) {
  console.log(data)
}
</script>

<template>
  <main>
    <splitpanes class="default-theme" style="height: 85svh">
      <pane size="20" min-size="20" max-size="30" class="flex flex-col gap-4 overflow-auto p-3">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">User Stories</h3>
          <div class="flex gap-3">
            <ButtonSmall text="+ Add" color="secondary" @click="handleOpenModal" />
            <ButtonSmall text="▶ Run" />
          </div>
        </div>
        <ul class="list-none flex flex-col gap-2">
          <li v-for="({ title }, key) in userStories.items" :key="key">
            <StoryCard :storyId="key" :title="title" status="processing" />
          </li>
        </ul>
      </pane>
      <pane size="80" min-size="50">
        <splitpanes horizontal>
          <pane size="95" class="overflow-auto"><TestCasesTable /></pane>
          <pane size="5" class="overflow-auto"
            >Info Panel
            <InfoStatus />
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
    <ModalAddStories
      :visible="modalVisible_addStories"
      @close-modal="handleCloseModal"
      @add-stories="handleAddStories"
    />
  </main>
</template>
