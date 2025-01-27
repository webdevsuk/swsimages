const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
    readImageFiles: (folderPath) => ipcRenderer.invoke('read-image-files', folderPath),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),

});
