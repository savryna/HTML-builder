const fs = require("node:fs")
const path = require('node:path')
const os = require('node:os');

const stream = fs.createReadStream(path.join(__dirname,'text.txt'), 'utf-8');
const EOL = os.EOL

stream.on('data', (chunk) => console.log(`${EOL}${chunk}`))
stream.on('error', (error) => console.log('Error', error.message))