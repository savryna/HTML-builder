const fsPromises = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const sourceFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'copyFiles');
  
  try {
 
    try {
      await fsPromises.access(copyFolderPath);
      await fsPromises.rm(copyFolderPath, { recursive: true, force: true });
    } catch (err) {
        console.error(err);
    }

    await fsPromises.mkdir(copyFolderPath, {recursive: true});
    const sourceFilesName = ((await fsPromises.readdir(sourceFolderPath)));
    for (let i = 0; i < sourceFilesName.length; i++) {
      await fsPromises.copyFile(path.join(sourceFolderPath, sourceFilesName[i]), path.join(copyFolderPath, sourceFilesName[i]))
    }
  } catch (err) {
    console.error(err);
  }
})()