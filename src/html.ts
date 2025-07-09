import type { User } from './types'

const svg: string = require('../images/icon.svg')
const encodedSVG = svg.replace(/"/g, '%22').replace(/#/g, '%23')

const generateHTML = (body: string, title = 'Auth0 Plugin for Insomnia'): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodedSVG}" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #3c3c3c;
            overflow: hidden;
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        h1 {
            color: #e6e6df
            margin-bottom: 5vh;
        }
        p {
            color: #978f8f
        }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 40vh;
        height: 40vh;
        border-radius: 5px;
        background-color: rgb(96 139 168 / 0.2);
      }
    </style>
</head>
<body>
    <div>${body}</div>
</body>
`
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
