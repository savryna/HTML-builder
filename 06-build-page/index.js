const fsPromises = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { error } = require('node:console');

const EOL = os.EOL
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

const srcPath = path.join(__dirname, 'template.html');
const destPath = path.resolve(__dirname, 'project-dist');
const destFilePath =  path.resolve(destPath, 'index.html');


async function createHtmlFile(srcHtmlPath, destHtmlPath, extension) {
  try {
    const componentsDir = path.resolve(__dirname, 'components');
    const srcHtmlData = await fsPromises.readFile(srcHtmlPath, 'utf8');
    const regExp = new RegExp(/{{.*?}}/, 'g');
    const srcParts = srcHtmlData.split(regExp);
    const componentsTags = srcHtmlData.match(regExp);
  
    const dataFromTag = await Promise.all(
      componentsTags.map(async (componentName) => {
        const srcComponentsPath = path.resolve(componentsDir, `${componentName.slice(2, -2)}${extension}`);
        const replaceData = await fsPromises.readFile(srcComponentsPath, 'utf8');
        return replaceData;
      }),
    );
  
    const fillHtml = srcParts.reduce((html, part, idx) => {
      html.push(part)
      html.push(dataFromTag[idx]);
      return html
    }, []).join(EOL)
  
    await fsPromises.writeFile(destHtmlPath, fillHtml);
  } catch (err) {
    console.error(err)
  }
}

mergeFiles(stylesFolder, '.css', projectFolder, projectFile)
  .then(() => copyFiles(assetsSrcFolder, assetsCopyFolder))
  .then(() => createHtmlFile(srcPath, destFilePath, '.html'))