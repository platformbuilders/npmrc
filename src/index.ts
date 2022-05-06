#! /usr/bin/env node
import readline from 'readline'
import os from 'os'
import fs from 'fs'

const askQuestion = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const readAnswer = (ans: string) => {
    const platform = process.platform
    const path = platform === 'linux' ? '/home' : '/Users'
    const data = `@platformbuilders:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${ans}\n`

    fs.appendFileSync(`${path}/${os.userInfo().username}/.npmrc`, data)
    rl.close()
  }

  return rl.question(query, readAnswer)
}

askQuestion(`
  - Entre nesse site: https://github.com/settings/tokens
  - Crie um token com o escopo de, no mínimo, 'REPO' e 'READ:PACKAGES'
  - Cole o token gerado aqui: `)
