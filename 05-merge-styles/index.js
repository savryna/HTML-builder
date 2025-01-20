const fsPromises = require('node:fs/promises');
const path = require('node:path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFile = path.join(__dirname, 'project-dist', 'bundle.css')


async function mergeFiles(srcFolder, extname, destFile) {
  const srcFiles = await (await fsPromises.readdir(srcFolder)).filter((file) => path.extname(file) === extname);
  const dataSrcFiles = await Promise.all(srcFiles.map((file) => fsPromises.readFile(path.join(srcFolder, file))));
  for (const dataFile of dataSrcFiles) {
    await fsPromises.appendFile(destFile, dataFile)
  }
}
mergeFiles(stylesFolder, '.css', projectFile)
