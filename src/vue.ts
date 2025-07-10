import { createApp, ref } from 'vue'

const injectVue = (element: Element) => {
  createApp({
    setup() {
      const message = ref('VueJs working!')
      return {
        message
      }
    }
  }).mount(element)
}

export default injectVue
