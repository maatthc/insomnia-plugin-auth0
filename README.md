# Auth0 plugin for Insomnia

This plugin allows you to use Auth0 web login for authentication in Insomnia. It provides a way to log in and out, and it can be used with any API that supports Auth0.

## Installation

Get if from the [Insomnia plugin store](https://insomnia.rest/plugins) or install it manually:
1. Clone the repository:
   ```bash
   git clone

2. Install dependencies:
   ```bash
   yarn 
   ```
3. Build the plugin:
   ```bash
   yarn build
   ```


## Configuration

Set the following environment variables in your [Insomnia environment](https://docs.insomnia.rest/insomnia/environment-variables):

```json
{
  "auth0Instances": [
    {
      "urlRegexs": ["dev.test.com"],
      "urlMethods": ["POST"],
      "auth0AuthType": "Bearer",
      "domain": "https://auth-dev.test.com",
      "clientId": "clientIdDev",
      "tokenTimeout": 240000,
      "authorizationParams": {
        "audience": "https://api.dev.test.com/gateway/graphql",
        "scope": "openid profile email offline_access"
      }
    },
    {
      "urlRegexs": ["nonprod.test.com"],
      "urlMethods": ["GET"],
      "auth0AuthType": "Bearer",
      "domain": "https://auth-nonprod.test.com",
      "clientId": "clientIdNonProd",
      "tokenTimeout": 240000,
      "authorizationParams": {
        "audience": "https://api.nonprod.test.com/gateway/graphql",
        "scope": "openid profile email offline_access"
      }
    }
  ],
  "auth0HttpServerPort": 3005
}

```

## TODO

- [x] Check if we need to refresh 'manually' the access token: follows "Refresh Token Expiration" in Auth0 configuration: 30 days
- [ ] Add Request Auto retry on Login
- [ ] Check for msg: Auth0 configuration changed
- [ ] Write test for applyHook 
- [ ] Should/could return ealier on applyHook?
- [ ] Add a step to verify configs that might be missing
- [ ] Add Vue/Svelt component for the Auth0 login/logout
- [ ] Generate screenshots
- [ ] Fix tests
- [ ] Publish to npm
