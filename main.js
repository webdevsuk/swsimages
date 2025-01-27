const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises; // use promises based API


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon/ico6.png'),
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        // nodeIntegration: false,
        // contextIsolation: true
        enableRemoteModule: false,
        
    },
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);
  // mainWindow.maximize();


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
});


ipcMain.handle('open-directory-dialog', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (filePaths && filePaths.length > 0) {
      return filePaths[0];      
    }
    return null;
});

ipcMain.handle('open-file-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'jfif', 'webp'] }
    ]
  });
  if (filePaths && filePaths.length > 0) {
    const folderName = path.dirname(filePaths[0]);
      // console.log(folderName);      
      filePaths.push(folderName);
      // console.log(filePaths[0], filePaths[1]);
    // return filePaths[0];
    return filePaths;
  }
  return null;
});

ipcMain.handle('read-image-files', async (event, folderPath) => {
  try {
    if (!folderPath) return [];
    const files = await fs.readdir(folderPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.jfif']; // Add other formats if needed
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    return imageFiles.map(file => path.join(folderPath, file))
  } catch (error) {
      console.error("Error reading folder:", error);
      return [];
  }

})

