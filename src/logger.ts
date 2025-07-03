export const success = (message, ...args) => console.log(`%c[Auth0] ${message}`, successStyle, ...args)

const logger = (func, message, ...args) => {
  func(`%c[Auth0] ${message}`, logStyle, ...args)
}

export const info = (message, ...args) => logger(console.info, message, ...args)
export const warn = (message, ...args) => logger(console.warn, message, ...args)
export const error = (message, ...args) => logger(console.error, message, ...args)
export const debug = (message, ...args) => logger(console.debug, message, ...args)
export const log = (message, ...args) => logger(console.log, message, ...args)

const successStyle = [
  'color: green',
  'background: yellow',
  'font-size: 30px',
  'border: 1px solid red',
  'text-shadow: 2px 2px black',
  'padding: 10px'
].join(';')

const logStyle = ['color: blue', 'background: gainsboro', 'padding: 2px'].join(';')
