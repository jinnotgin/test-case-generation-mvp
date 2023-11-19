import { defineStore } from 'pinia'

export const useUserStoriesStore = defineStore('user-stories', {
  state: () => ({
    items: {
      'SLS-8040': {
        title:
          "As Teacher, given a Question with Speech Evaluation (SE) component in a Teacher Release Quiz, only allowed to mark my student's responses after the external Speech Evaluation engine has provided marks recommendations",
        content: ''
      },
      'SLS-8041': {
        title:
          "As Teacher, given a Question with Speech Evaluation (SE) component in a Teacher Release Quiz, only allowed to mark my student's responses after the external Speech Evaluation engine has provided marks recommendations",
        content: ''
      }
    }
  }),
  actions: {
    addItem(key, title, content) {
      this.items[key] = { title, content }
    }
  }
})
