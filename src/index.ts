#! /usr/bin/env node
// import readline from 'readline'
import os from 'os'
import fs from 'fs'
import inquirer from 'inquirer'

const startInquirer = async () => {
  const promptToken: Record<'token', string> = await inquirer.prompt([
    {
      type: 'input',
      name: 'token',
      message: '- Entre nesse site: https://github.com/settings/tokens\n- Crie um token com o escopo de, no mínimo, \'REPO\' e \'READ:PACKAGES\'\n- Cole o token gerado aqui:'
    }
  ])

  const promptOrganizations: Record<'organizations', string[]> = await inquirer.prompt(
    [
      {
        type: 'checkbox',
        message: 'Deseja ter acesso aos packages de quais organizações?',
        name: 'organizations',
        choices: [
          {
            name: 'PlatformBuilders',
            value: '@platformbuilders'
          },
          {
            name: 'BuildersBank',
            value: '@buildersbank'
          },
          {
            name: 'Outra organização',
            value: '@custom_org'
          }
        ],
        validate (answer) {
          if (answer.length < 1) {
            return 'Você deve escolher pelo menos uma opção'
          }

          return true
        }
      }
    ]
  )

  const haveCustomOrg = promptOrganizations.organizations.includes('@custom_org')

  if (haveCustomOrg) {
    const promptCustomOrg: Record<'customOrg', string> = await inquirer.prompt([
      {
        type: 'input',
        name: 'customOrg',
        message: 'Digite aqui o escopo da organização (ex: @platformbuilders):'
      }
    ])

    promptOrganizations.organizations.splice(promptOrganizations.organizations.length - 1, 1, promptCustomOrg.customOrg)
  } else {
    promptOrganizations.organizations.splice(promptOrganizations.organizations.length - 1, 0)
  }

  const platform = process.platform
  const path = platform === 'linux' ? '/home' : '/Users'

  promptOrganizations.organizations.forEach(organization => {
    const data = `${organization}:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${promptToken.token}\n`
    fs.appendFileSync(`${path}/${os.userInfo().username}/.npmrc`, data)
  })
}

startInquirer()
