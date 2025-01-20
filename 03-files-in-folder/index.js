const fsPromises = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');


(async () => {
  const EOL = os.EOL
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    const folderAll = await fsPromises.readdir(folderPath, {withFileTypes: true});
    const folderFiles = await folderAll.filter((item) => item.isFile())
    const filesPaths = folderFiles.map((file) => path.join(__dirname, 'secret-folder', file.name));
    const filesSize = (await Promise.all(filesPaths.map((path) => fsPromises.stat(path)))).map((statFile) => statFile.size);

    const infoArray = Array.from({length: folderFiles.length}, (_, idx) => `${path.basename(filesPaths[idx], path.extname(filesPaths[idx]))} - ${path.extname(filesPaths[idx])} - ${filesSize[idx]}b`);
    console.table(infoArray)
  } catch (err) {
    console.error(err);
  }
})()
