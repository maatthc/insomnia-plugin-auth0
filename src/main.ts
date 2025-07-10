import { Auth0 } from './auth0'
import type { Context } from './types'
import injectVue from './vue'

const auth0 = new Auth0()

const requestHooks = [auth0.applyHook]

const workspaceActions = [
  {
    label: 'Auth0 Login',
    icon: 'shield-halved',
    action: async (context: Context) => {
      const vue = document.createElement('div')
      vue.innerText = '{{message}}'
      injectVue(vue)
      context.app.dialog('Auth0', vue, { tall: true, wide: true })
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
  },
  {
    label: 'Remove "Invite"',
    icon: 'poo',
    action: async () => {
      var element = window.document.querySelector('[aria-label^="Invite collaborators"]') as HTMLElement
      if (element) {
        element.style.display = 'none'
        return
      }
      console.info('Element not found, skipping style change')
    }
  }
]

export { requestHooks, workspaceActions }
