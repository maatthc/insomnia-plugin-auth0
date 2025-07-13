import { createApp } from 'vue'
import './http/style.css'
import App from './App.vue'

const createVue = (): Element => {
  const vue = document.createElement('div')
  createApp(App).mount(vue)
  return vue
}

export default createVue
