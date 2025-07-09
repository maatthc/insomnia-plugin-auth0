import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import * as Auth0Client from '@auth0/auth0-spa-js'
import * as httpServer from './http/http-server'
import { Auth0 } from './auth0'
import type { Context } from './types'
import _config from './fixtures/insomnia-config.json'

describe('Auth0 Class Tests', () => {
  let auth0: Auth0
  let context: Context
  let config = _config

  vi.mock('@auth0/auth0-spa-js')

  let loginWithRedirect = vi.fn()
  let isAuthenticated = vi.fn().mockResolvedValue(false)
  let getTokenSilently = vi.fn().mockResolvedValue('mocked-token')

  ;(Auth0Client as any).createAuth0Client = vi.fn().mockResolvedValue({ loginWithRedirect, isAuthenticated, getTokenSilently })

  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    auth0 = new Auth0()
    config = structuredClone(_config)
    context = {
      request: {
        getEnvironment: vi.fn().mockReturnValue(config),
        getBody: vi.fn(),
        getHeader: vi.fn(),
        setHeader: vi.fn(),
        getMethod: vi.fn().mockReturnValue('POST'),
        getUrl: vi.fn().mockReturnValue('http://dev.test.com')
      }
    }
  })

  describe('ignoreRequest', () => {
    test('should return true if introspection query', () => {
      context.request.getBody.mockReturnValue({ text: 'IntrospectionQuery' })
      expect(auth0.ignoreRequest(context)).toBe(true)
    })

    test('should return true if Authorization header already set', () => {
      context.request.getHeader.mockReturnValue('Bearer token')
      expect(auth0.ignoreRequest(context)).toBe(true)
    })

    test('should return true if no Auth0 instances configured', () => {
      context.request.getEnvironment.mockReturnValue({})
      expect(auth0.ignoreRequest(context)).toBe(true)
    })

    test('should return false if Auth0 instances configured and no header set', () => {
      expect(auth0.ignoreRequest(context)).toBe(false)
    })
  })

  describe('manageConfiguration', async () => {
    let logout: MockInstance
    beforeEach(() => {
      auth0 = new Auth0()
      logout = vi.spyOn(auth0, 'logout')
    })

    test('should call createAuth0Client() if Auth0 not initialized', async () => {
      auth0.manageConfiguration(context)
      expect(Auth0Client.createAuth0Client).toHaveBeenCalledTimes(2)
      expect(logout).not.toHaveBeenCalled()
    })

    test('should call monitorServerNotification when authenticated', async () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      await auth0.manageConfiguration(context)
      expect(addEventListenerSpy).toHaveBeenCalledWith('Authenticated', expect.any(Function))
    })

    test('should use default value if serverPort not provided ', async () => {
      config.auth0HttpServerPort = undefined
      const server = vi.spyOn(httpServer, 'default')
      await auth0.manageConfiguration(context)
      expect(server).toHaveBeenCalledWith(expect.any(Object), 3005)
    })

    test('should start httpServer when initialized', async () => {
      const server = vi.spyOn(httpServer, 'default')
      await auth0.manageConfiguration(context)
      expect(server).toHaveBeenCalledWith(expect.any(Object), config.auth0HttpServerPort)
    })

    test('should call logout if Auth0 is initialized but configs is different', async () => {
      await auth0.manageConfiguration(context)
      config.auth0HttpServerPort = 4000 // Simulate a change in config
      await auth0.manageConfiguration(context)
      expect(logout).toHaveBeenCalledTimes(1)
    })
  })

  describe('manageAuthentication', async () => {
    beforeEach(() => {
      auth0 = new Auth0()
    })

    test('should ignore authentication if not configured', async () => {
      await auth0.manageAuthentication(context)
      expect(Auth0Client.createAuth0Client).not.toHaveBeenCalled()
      expect(isAuthenticated).not.toHaveBeenCalled()
    })

    test('should call loginWithRedirect if not authenticated', async () => {
      await auth0.manageConfiguration(context)
      await auth0.manageAuthentication(context)
      expect(Auth0Client.createAuth0Client).toHaveBeenCalledTimes(2)
      expect(isAuthenticated).toHaveBeenCalledTimes(1)
      expect(loginWithRedirect).toHaveBeenCalledTimes(1)
      expect(getTokenSilently).toHaveBeenCalledTimes(0)
    })

    test('should call getTokenSilently if authenticated', async () => {
      isAuthenticated.mockResolvedValue(true)
      context.request.getUrl.mockReturnValue('https://api.nonprod.test.com')

      await auth0.manageConfiguration(context)
      await auth0.manageAuthentication(context)
      expect(Auth0Client.createAuth0Client).toHaveBeenCalledTimes(2)
      expect(isAuthenticated).toHaveBeenCalledTimes(1)
      expect(loginWithRedirect).toHaveBeenCalledTimes(0)
      expect(getTokenSilently).toHaveBeenCalledTimes(1)
    })
  })

  describe('manageHeader', async () => {
    const setup = async () => {
      await auth0.manageConfiguration(context)
      await auth0.manageAuthentication(context)
      await auth0.manageHeader(context)
    }

    beforeEach(() => {
      auth0 = new Auth0()
    })

    test('should add Auth header if request method and url regex match configuration', async () => {
      isAuthenticated.mockResolvedValue(true)
      await setup()
      expect(context.request.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer mocked-token')
    })

    test('should add Auth header content based on AuthType configuration', async () => {
      isAuthenticated.mockResolvedValue(true)
      config.auth0Instances[0].auth0AuthType = 'Basic'
      await setup()
      expect(context.request.setHeader).toHaveBeenCalledWith('Authorization', 'Basic mocked-token')
    })

    test('should not add Auth header if request url regex do not match configuration', async () => {
      isAuthenticated.mockResolvedValue(true)
      context.request.getUrl.mockReturnValue('https://api.prod.test.com')
      await setup()
      expect(context.request.setHeader).not.toHaveBeenCalled()
    })

    test('should not add Auth header if request method do not match configuration', async () => {
      isAuthenticated.mockResolvedValue(true)
      context.request.getUrl.mockReturnValue('https://api.nonprod.test.com')
      await setup()
      expect(context.request.setHeader).not.toHaveBeenCalled()
    })
  })
})
