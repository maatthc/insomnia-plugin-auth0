import type { User } from '../types'
var page: string = require('./page.html')
const svg: string = require('../../images/icon.svg')

const encodedSVG = svg.replace(/"/g, '%22').replace(/#/g, '%23')

const generateHTML = (content: string): string => {
  page = page.replace('{{svg}}', encodedSVG)
  page = page.replace('{{svg}}', encodedSVG)
  page = page.replace('{{content}}', content)
  return page
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
