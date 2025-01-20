const fsPromises = require('node:fs/promises');
const path = require('node:path');
const checkExists = require('../04-copy-directory/index.js')

const stylesFolder = path.join(__dirname, 'styles');
// const projectFolder = path.join(__dirname, 'project-dist')
const projectFile = path.join(__dirname, 'project-dist', 'bundle.css')


async function mergeFiles(srcFolder, extname, destFile) {
  const srcFiles = await (await fsPromises.readdir(srcFolder)).filter((file) => path.extname(file) === extname);
  const dataSrcFiles = await Promise.all(srcFiles.map((file) => fsPromises.readFile(path.join(srcFolder, file))));
  
  await checkExists(destFile);
  // const destFile = 
  for (const dataFile of dataSrcFiles) {
    await fsPromises.appendFile(destFile, dataFile)
  }
}
mergeFiles(stylesFolder, '.css', projectFile)
