import express from 'express'
import { authenticatedHTML, logoutHTML } from './html'
import { debug, info, success } from '../logger'
import type { Auth0Instance } from '../types'

const app = express()

const server = async (auth0Instances: Auth0Instance[], port: number) => {
  app.get('/{*trek}', async (req, res) => {
    debug(`HTTP server Received request`)

    const isLogout = !req.query.code && !req.query.state

    if (isLogout) {
      info('Logging out user..')
      res.send(logoutHTML())
      return
    }
    try {
      await Promise.all(
        auth0Instances.map(async (instance) => {
          const result = await instance.auth0.handleRedirectCallback(req.url)
          debug(`Redirect callback result: ${JSON.stringify(result)}`)
          document.dispatchEvent(
            new CustomEvent('Authenticated', {
              detail: { status: 'ok' }
            })
          )
          const user = await instance.auth0.getUser()
          res.send(authenticatedHTML(user))
        })
      )
    } catch {}
  })

  app.listen(port, () => {
    success(`HTTP Server is running on http://localhost:${port}`)
  })
}
export default server
