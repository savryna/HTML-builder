const fsPromises = require('node:fs/promises');
const path = require('node:path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const projectFile = path.join(__dirname, 'project-dist', 'style.css');
const assetsSrcFolder = path.join(__dirname, 'assets');
const assetsCopyFolder = path.join(projectFolder, 'assets');

async function mergeFiles(srcFolder, extname, destFolder, destFile) {
  const srcFiles = await (await fsPromises.readdir(srcFolder)).filter((file) => path.extname(file) === extname);
  const dataSrcFiles = await Promise.all(srcFiles.map((file) => fsPromises.readFile(path.join(srcFolder, file))));

  await checkExists(destFolder);
  await fsPromises.mkdir(destFolder, { recursive: true });
  
  await checkExists(destFile);

  for (const dataFile of dataSrcFiles) {
    await fsPromises.appendFile(destFile, dataFile);
  }
}

async function copyFiles(sourceFolder, copyFolder) {
  try {
    await fsPromises.mkdir(copyFolder, { recursive: true });
    const sourceItemsName = await fsPromises.readdir(sourceFolder);

    const copyPromises = sourceItemsName.map(async (copyItem) => {
      const sourceItemPath = path.join(sourceFolder, copyItem);
      const copyItemPath = path.join(copyFolder, copyItem);
      const statItem = await fsPromises.stat(sourceItemPath);

      if (statItem.isDirectory()) {
        return copyFiles(sourceItemPath, copyItemPath); 
      } else {
        return fsPromises.copyFile(sourceItemPath, copyItemPath);
      }
    });

    await Promise.all(copyPromises);
  } catch (err) {
    console.error(err);
  }
}

async function checkExists(checkPath) {
  try {
    await fsPromises.access(checkPath);
    await fsPromises.rm(checkPath, { recursive: true, force: true });
  } catch (err) {
    if(path.extname(checkPath)){
      await fsPromises.writeFile(checkPath, '')
    } else if(!path.extname(checkPath)) {
      await fsPromises.mkdir(checkPath, {recursive: true});
    } else {
      console.error(err)
    }
  }
}

const srcHtmlPath = path.join(__dirname, 'template.html');
const destHtmlFolderPath = path.join(__dirname, 'project-dist');
const destHtmlFile = path.join(destHtmlFolderPath, 'index.html')

const componentsPath = {
    '{{header}}': path.join(__dirname, 'components', 'header.html'),
    '{{footer}}': path.join(__dirname, 'components', 'footer.html'), 
    '{{articles}}': path.join(__dirname, 'components', 'articles.html')
}

async function createHtmlFile(srcFile, destHtmlFile,  componentsPath) {
  await fsPromises.copyFile(srcFile, destHtmlFile)
  let dataCopyFile = await fsPromises.readFile(destHtmlFile, 'utf-8')

  for (const [templateTag, sourceFilePath] of Object.entries(componentsPath)) {
    const sourceContent = await fsPromises.readFile(sourceFilePath, 'utf-8');
    dataCopyFile = dataCopyFile.replace(templateTag, sourceContent);
  }

  await fsPromises.writeFile(destHtmlFile, dataCopyFile, 'utf-8');
}

mergeFiles(stylesFolder, '.css', projectFolder, projectFile)
  .then(() => copyFiles(assetsSrcFolder, assetsCopyFolder))
  .then(() => createHtmlFile(srcHtmlPath, destHtmlFile, componentsPath))