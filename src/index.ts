#! /usr/bin/env node
import readline from 'readline'
import os from 'os'
import fs from 'fs'

const platform = process.platform

const askQuestion = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const readAnswerDarwin = (ans: string) => {
    const data = `@platformbuilders:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${ans}\n`
    fs.appendFileSync(`/Users/${os.userInfo().username}/.npmrc`, data)
    rl.close()
  }

  const readAnswerLinux = (ans: string) => {
    const data = `@platformbuilders:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${ans}\n`
    fs.appendFileSync(`/home/${os.userInfo().username}/.npmrc`, data)
    rl.close()
  }

  const readByPlatform = {
    darwin: rl.question(query, readAnswerDarwin),
    linux: rl.question(query, readAnswerLinux)
  }

  return readByPlatform[platform]
}

const ans = async () => {
  if (platform !== 'darwin' && platform !== 'linux') {
    return console.log('Script feito apenas para MacOS e Linux. Por favor, aguarde uma próxima versão!')
  }

  askQuestion(`
  - Entre nesse site: https://github.com/settings/tokens
  - Crie um token com o escopo de, no mínimo, 'REPO' e 'READ:PACKAGES'
  - Cole o token gerado aqui: `)
}

ans()
