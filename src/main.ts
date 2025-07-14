import { Auth0 } from './auth0'
import type { Context } from './types'
import createVue from './vue'
import { warn } from './logger'

const auth0 = new Auth0()
globalThis.auth0 = auth0

const requestHooks = [auth0.applyHook]

const workspaceActions = [
  {
    label: 'Auth0 Login/Logout',
    icon: 'shield-halved',
    action: async (context: Context, models: any) => {
      if (auth0.auth0Instances.length === 0) {
        warn('Not initialized: forcing.. ')
        auth0.forceInitialization()
        const localRequest = models.requests.find((req) => req.url.includes('localhost'))
        const req = localRequest || models.requests[0]
        if (req) await context.network.sendRequest(req)
      }
      const vue = createVue()
      context.app.dialog('Auth0 Plugin', vue, { tall: true, wide: true })
    }
  },
  {
    label: 'Auth0 Server Shutdown',
    icon: 'power-off',
    action: async () => {
      auth0.closeServer()
    }
  }
]

export { requestHooks, workspaceActions }
