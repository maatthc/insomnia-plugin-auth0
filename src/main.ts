// import './assets/main.css'
//
// import { createApp } from 'vue'
// import App from './App.vue'
//
// createApp(App).mount('#app')

import { Auth0 } from './auth0'

const auth0 = new Auth0()

//TODO: remove
// Should query for element until it is found and removed
// const removeUIElementsIdontLike = () => {
//   var element = window.document.querySelector('[aria-label^="Invite collaborators"]')
//   if (element) {
//     element.style.display = 'none'
//     return
//   }
//   info('Element not found, skipping style change')
// }

const requestHooks = [auth0.applyHook]

const workspaceActions = [
  {
    label: 'Auth0 Login',
    icon: 'truck-fast',
    action: async () => {
      //TODO: implement
      // await auth0.loginWithRedirect()
    }
  },
  {
    label: 'Auth0 Logout',
    icon: 'truck-fast',
    action: async () => {
      await auth0.logout()
    }
  },
  {
    label: 'Auth0 Shutdown',
    icon: 'fire',
    action: async () => {
      auth0.closeServer()
    }
  }
]

export { requestHooks, workspaceActions }
