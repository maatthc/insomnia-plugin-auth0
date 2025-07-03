import { createAuth0Client } from '@auth0/auth0-spa-js'
import server from './http-server'
import type { Auth0Instance, Config, Context } from './types'
import { debug, error, info, warn } from './logger'

export class Auth0 {
  existingConfig: Config = undefined
  auth0Instances: Auth0Instance[] = []

  constructor() {
    info('Plugin constructed.')
  }

  private redirectUri() {
    return `http://localhost:${this.existingConfig.auth0HttpServerPort}`
  }

  private monitorServerNotification() {
    document.addEventListener('Authenticated', async () => {
      this.auth0Instances.map(async (instance) => {
        try {
          instance.token = await instance.auth0.getTokenSilently()
          info(`Token retrieved for: ${instance.domain}`)
        } catch {}
      })
    })
  }

  public ignoreRequest(context: Context): boolean {
    const isIntrospection = (context: Context) => {
      return context.request.getBody()?.text?.includes('IntrospectionQuery')
    }

    if (isIntrospection(context)) {
      debug('Skipping Auth token for IntrospectionQuery')
      return true
    }

    if (context.request.getHeader('Authorization')) {
      debug('Authorization header already set, skipping Auth token setup')
      return true
    }

    const insomniaConfig = this.extractConfig(context)?.auth0Instances
    if (!this.existingConfig && (!insomniaConfig || 1 > insomniaConfig.length)) {
      debug('No Auth0 instances configured, skipping Auth token setup')
      return true
    }
    return false
  }

  private extractConfig(context: Context): Config | null {
    const config = context.request.getEnvironment()
    if (!config || !config.auth0Instances) {
      return
    }
    return {
      auth0Instances: config?.auth0Instances,
      auth0HttpServerPort: config?.auth0HttpServerPort || 3005
    }
  }

  public async manageConfiguration(context: Context) {
    const insomniaConfig = this.extractConfig(context)
    if (insomniaConfig.auth0Instances && !this.existingConfig) {
      await this.initialize(insomniaConfig)
      return
    }
    if (JSON.stringify(insomniaConfig) === JSON.stringify(this.existingConfig)) {
      return
    }
    warn('Configuration changed, re-initializing...')
    this.logout()
  }

  private async initialize(insomniaConfig: Config) {
    info('Initializing Auth0 Clients...')
    this.existingConfig = insomniaConfig
    this.auth0Instances = await Promise.all(
      this.existingConfig.auth0Instances?.map(async (instance) => {
        const auth0 = await createAuth0Client({
          domain: instance.domain,
          clientId: instance.clientId,
          cacheLocation: 'localstorage',
          useRefreshTokens: true,
          authorizationParams: instance.authorizationParams
        })

        info(`Auth0 Client initialized for domain: ${instance.domain}`)
        return {
          ...instance,
          auth0,
          token: undefined,
          interval: undefined,
          redirect_uri: this.redirectUri(),
          authorizationParams: {
            ...instance.authorizationParams,
            redirect_uri: this.redirectUri()
          }
        }
      })
    )
    this.monitorServerNotification()
    await server(this.auth0Instances, this.existingConfig.auth0HttpServerPort)
  }

  public async manageAuthentication(context: Context) {
    const instance = await this.findAuth0Instance(context)
    if (!instance) {
      debug('No Auth0 instance found for the current request')
      return
    }
    if (!(await this.isLogged(instance))) {
      info('User is not authenticated!')
      await this.login(instance)
    }
  }

  private async findAuth0Instance(context: Context): Promise<Auth0Instance | null> {
    if (!this.auth0Instances || 1 > this.auth0Instances.length) {
      info('No Auth0 instances configured')
      return 
    }
    const url = context.request.getUrl()
    debug(`Finding Auth0 instance for URL: ${url}`)
    const instance = this.auth0Instances.find((instance) => instance?.urlRegexs?.some((urlPattern) => new RegExp(urlPattern).test(url)))
    return instance
  }

  private async login(instance: Auth0Instance) {
    if (!instance) {return}
    try {
      info(`Logging in for domain ${instance.domain}..`)
      await instance.auth0.loginWithRedirect({ authorizationParams: instance.authorizationParams })
      // TODO: Uncomment the interval logic if Auth0 requires periodic token refresh
      // instance.interval = window.setInterval(async () => {
      //   info(`Refreshing token silently due timeout(${instance.interval}) for domain ${instance.domain} ...`)
      //   instance.token = await instance.auth0.getTokenSilently()
      // }, instance.tokenTimeout)
    } catch (error) {
      error(`Log in failed :${error}`)
    }
  }

  private async isLogged(instance: Auth0Instance): Promise<boolean> {
    if (!instance || !instance.auth0) {
      debug('No Auth0 instance or auth0 client found')
      return false
    }
    debug(`Checking if user is authenticated for domain: ${instance.domain}`)
    if (!(await instance?.auth0?.isAuthenticated())) {return false}

    try {
      instance.token = await instance.auth0.getTokenSilently({
        cacheMode: 'off'
      })
      debug(`auth0.getTokenSilently is saying User is authenticated for domain: ${instance.domain}`)
      return true
    } catch {
      return false
    }
  }

  public async manageHeader(context: Context) {
    const method = context.request.getMethod().toUpperCase()
    const instance = await this.findAuth0Instance(context)
    if (instance?.urlMethods.includes(method)) {
      if (await this.isLogged(instance)) {
        info(`User is authenticated, setting Auth token for domain: ${instance.domain}`)
        context.request.setHeader('Authorization', `${instance.auth0AuthType} ${instance.token}`)
      }
    }
  }

  public async logout() {
    info('Logging user out...')
    this.auth0Instances.map(async (instance) => {
      if (await instance.auth0.isAuthenticated()) {
        await instance.auth0.logout()
        if (instance.interval) {
          clearInterval(instance.interval)
        }
        instance.token = undefined
        instance.interval = undefined
      }
    })
  }

  public applyHook = async (context: Context) => {
    if (this.ignoreRequest(context)) {return}
    await this.manageConfiguration(context)
    await this.manageAuthentication(context)
    await this.manageHeader(context)
  }
}
