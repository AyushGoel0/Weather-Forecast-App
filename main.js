const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let detailWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createDetailWindow(cityData) {
  detailWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  detailWindow.loadFile('detail.html');

  detailWindow.webContents.on('did-finish-load', () => {
    detailWindow.webContents.send('city-data', cityData);
  });

  detailWindow.on('closed', () => {
    detailWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC communication for opening detail window
ipcMain.on('open-detail', (event, cityData) => {
  createDetailWindow(cityData);
});
