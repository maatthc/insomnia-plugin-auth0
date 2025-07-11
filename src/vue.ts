import { createApp } from 'vue'
import './http/style.css'
import App from './App.vue'

// Vue course: https://www.youtube.com/watch?v=s9URD3PefTk&t=66setup
//
const createVue = (): Element => {
  const vue = document.createElement('div')
  vue.innerText = '{{message}}'

  createApp(App).mount(vue)
  return vue
}

export default createVue
