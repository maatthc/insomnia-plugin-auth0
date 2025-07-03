'use strict'
const fs = require('node:fs')
const request = require('request')
const semver = require('semver')

const npmPackageName = 'insomnia-plugin-auth0'

async function execute() {
  const dataJson = fs.readFileSync('package.json').toString()
  const dataObj = JSON.parse(dataJson)

  const getCurrentVersionAsync = async () =>
    new Promise((resolve, reject) => {
      request(
        `https://registry.npmjs.org/-/package/${npmPackageName}/dist-tags`,
        {
          json: true
        },
        (error, res, body) => {
          if (error || 200 !== res.statusCode) {reject()}
          resolve(body.latest)
        }
      )
    })

  const buildVersionAsync = async (configuredVersion) => {
    const deployedVersion = await getCurrentVersionAsync()

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

  const version = await buildVersionAsync(dataObj.version)
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
  if (!fs.existsSync('dist')) {fs.mkdirSync('dist')}
  fs.writeFileSync('dist/package.json', resultJson)
  // Copy all required files to the dist folder
}

execute()
