import { createApp, ref } from 'vue'

// Vue course: https://www.youtube.com/watch?v=s9URD3PefTk&t=66setup
//
const createVue = (): Element => {
  const vue = document.createElement('div')
  vue.innerText = '{{message}}'

  createApp({
    setup() {
      const message = ref(`VueJs working! Date: ${new Date()}`)
      return {
        message
      }
    }
  }).mount(vue)
  return vue
}

export default createVue
