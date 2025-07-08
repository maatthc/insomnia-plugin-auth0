'use strict'
import fs from 'node:fs'
import os from 'node:os'
import { join } from 'node:path'

const pluginName = 'insomnia-plugin-auth0'

const findPath = () => {
  const platform = os.platform()
  const homeDir = os.homedir()
  if (platform === 'darwin') {
    return `${homeDir}/Library/Application Support/`
  } else if (platform === 'linux') {
    return `${homeDir}/.config/`
  } else if (platform === 'win32') {
    return process.env.LOCALAPPDATA
  } else {
    throw new Error(`Unsupported platform: ${platform}`)
  }
}

const pluginsPath = join(findPath(), 'Insomnia', 'plugins')
if (!fs.existsSync(pluginsPath)) {
  console.error(`Insomnia path not found: ${pluginsPath}`)
  process.exit(1)
}

if (!fs.existsSync('dist')) {
  console.error('dist directory does not exist. Please run the build script first.')
  process.exit(1)
}

const pluginPath = join(pluginsPath, pluginName)
fs.cpSync('dist', pluginPath, { recursive: true, force: true })
