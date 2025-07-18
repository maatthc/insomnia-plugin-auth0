import type { User } from '../types'
import { encodedSvg } from '../utils'

if (process.env.MODE === 'test') var page = ''
else var page: string = require('./template.html')

const svg: string = require('../../images/icon.svg')

const encodedSVG = encodedSvg(svg)

const generateHTML = (content: string): string => {
  var body = page.replace('{{svg}}', encodedSVG)
  body = body.replace('{{svg}}', encodedSVG)
  body = body.replace('{{content}}', content)
  return body
}

const authenticatedHTML = (user: User): string => {
  return generateHTML(
    `
      <h1>Welcome</h1>
      <h2>${user.name}!</h2>
      <p>Authenticated as: ${user.email}</p>
  `
  )
}

const logoutHTML = (): string => {
  return generateHTML(
    `
    <h1>Logout successful</h1>
    <p>You have been logged out.</p>
  `
  )
}

export { authenticatedHTML, logoutHTML }
