const {stdin, stdout, stderr} = process;
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os');

const EOL = os.EOL
const filePath = path.join(__dirname, 'userInput.txt')
const nextInput = '>>> '
const userGreeting = `${EOL}Write what you want to add to the file${EOL}${nextInput}`
const commandForExit = 'exit'
const goodbye = `${EOL}The program is stopped.${EOL}`

stdout.write(userGreeting)

fs.writeFile(filePath, '', (error) => {
  if (error) throw error
})

stdin.on('data', (data) => {
  stdout.write(nextInput)
  const userInput = data.toString()
  fs.appendFile(filePath, userInput, (error) => {
    if (error) throw error;
  })
  if (userInput.trim() === commandForExit) {
    process.exit();
  }
})

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', (code) => {
  if (code === 0) {
    stdout.write(goodbye)
  } else {
    stderr.write(`Something went wrong. The program exited with code: ${code}${EOL}`)
  }
})

