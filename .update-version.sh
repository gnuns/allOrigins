#!/usr/bin/env node

const readline = require('readline')
const {exec} = require('child_process')

const vMap = {
  1: 'patch',
  2: 'minor',
  3: 'major',
}

function updateVersion (versionChange) {
  const command = `npm version ${vMap[versionChange]}`

  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return resolve(stderr)
      resolve(stdout)
    })
  })
}

function readInt () {
  return new Promise((resolve) => {
    const rl = readline.createInterface(process.stdin, process.stdout)

    rl.setPrompt('? ')
    rl.prompt()

    rl.on('line', (input) => {
      if (!input.length) return resolve(0)

      input = parseInt(input)

      if ([0, 1, 2, 3].includes(input)) {
        rl.close()
        return resolve(input)
      }

      rl.prompt()
    })
  })
}

async function main () {
  console.log("Hey! It's a [1] PATCH, [2] MINOR, or a [3] MAJOR change?")
  console.log('Default is [0] (no version change)')

  const versionChange = await readInt()

  if (!versionChange) {
    console.log('Ok! bye.')
    return process.exit(0)
  }

  console.log(await updateVersion(versionChange))
}

main()
