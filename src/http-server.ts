import express from 'express'
import { debug, info, success } from './logger'
import type { Auth0Instance } from './types'

const app = express()

const server = async (auth0Instances: Auth0Instance[], port: number) => {
  app.get('/{*trek}', async (req, res) => {
    debug(`HTTP server Received request`)

    const isLogout = !req.query.code && !req.query.state

    if (isLogout) {
      info('Logging out user..')
      res.send('<h1>Logout successful</h1>')
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
          res.send(`<h1>Auth0 : ${user ? 'Welcome' : 'Failed'}</h1>\n<h3>Nickname: ${user.nickname}</h3>\n<h3>Email: ${user.email}</h3>`)
        })
      )
    } catch {}
  })

  app.listen(port, () => {
    success(`HTTP Server is running on http://localhost:${port}`)
  })
}
export default server
