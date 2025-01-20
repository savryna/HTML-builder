const fsPromises = require('node:fs/promises');
const path = require('node:path');

const sourceFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'copyFiles');

async function copyFiles(sourceFolder, copyFolder) {
  try {
    await checkExists(copyFolder);
    await fsPromises.mkdir(copyFolder, {recursive: true});
    const sourceFilesName = ((await fsPromises.readdir(sourceFolder)));
    for (let i = 0; i < sourceFilesName.length; i++) {
      await fsPromises.copyFile(path.join(sourceFolder, sourceFilesName[i]), path.join(copyFolder, sourceFilesName[i]))
    }
  } catch (err) {
    console.error(err);
  }
}

async function checkExists(checkPath) {
  try {
    await fsPromises.access(checkPath);
    await fsPromises.rm(checkPath, { recursive: true, force: true });
  } catch (err) {
      await fsPromises.mkdir(checkPath, {recursive: true});
      // console.error(err);
  }
}

copyFiles(sourceFolderPath, copyFolderPath)