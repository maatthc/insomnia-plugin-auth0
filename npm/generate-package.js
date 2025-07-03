'use strict'
import fs from 'node:fs'
import axios from 'axios'
import semver from 'semver'

const npmPackageName = 'insomnia-plugin-auth0'

const getCurrentVersion = async () => {
  const url = `https://registry.npmjs.org/-/package/${npmPackageName}/dist-tags`
  try {
    console.info(`Fetching current version from npm: ${url}`)
    const response = await axios.get(url)
    console.info(`Current version fetched: ${response?.data?.latest}`)
    return response?.data?.latest || null
  } catch (error) {
    console.error(`Error fetching current version from npm: ${error.message}`)
  }
}

const buildVersion = async (configuredVersion) => {
  const deployedVersion = await getCurrentVersion()
  if (!deployedVersion) {
    console.warn(`No deployed version found, using configured version: ${configuredVersion}`)
    return configuredVersion
  }

  console.info(`Configured version: ${configuredVersion}`)
  console.info(`Deployed version: ${deployedVersion}`)

  if (semver.gt(configuredVersion, deployedVersion)) {
    console.warn('Will be used configured version as it is greater then deployed')
    return configuredVersion
  }

  const incrementedVersion = semver.inc(deployedVersion, 'patch')
  console.info(`New version generated: ${incrementedVersion}`)
  return incrementedVersion
}

async function execute() {
  const dataJson = fs.readFileSync('package.json').toString()
  const dataObj = JSON.parse(dataJson)

  const version = await buildVersion(dataObj.version)
  const resultObj = {
    name: dataObj.name,
    version: version,
    main: 'main.js',
    author: dataObj.author,
    license: dataObj.license,
    repository: dataObj.repository,
    bugs: dataObj.bugs,
    insomnia: dataObj.insomnia,
    dependencies: dataObj.dependencies
  }

  const resultJson = JSON.stringify(resultObj, undefined, 2)
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
  }
  fs.writeFileSync('dist/package.json', resultJson)
  fs.copyFileSync('README.md', 'dist/README.md')
  fs.cpSync('images', 'dist/images', { recursive: true })
}

execute()
