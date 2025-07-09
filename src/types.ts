import type { User as Auth0User, Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js'

export interface Auth0Instance extends Auth0ClientOptions {
  auth0?: Auth0Client
  token?: string
  interval?: number
  urlRegexs?: RegExp[]
  urlMethods?: string[]
  auth0AuthType?: string
}

export interface Config {
  auth0Instances: Auth0Instance[]
  auth0HttpServerPort: 3001
}

export interface Context {
  request: {
    getEnvironment: () => { [key: string]: any }
    getBody: () => { text?: string }
    getHeader: (header: string) => string | null
    setHeader: (header: string, value: string) => void
    getMethod: () => string
    getUrl: () => string
  }
}

export type User = Auth0User
