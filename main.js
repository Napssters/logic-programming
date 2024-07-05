const { app, BrowserWindow, screen, ipcMain } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let loadingWindow;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  loadingWindow.loadFile(path.join(__dirname, 'loading.html'));
}

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'icono.ico')
  });

  mainWindow.loadFile(path.join(__dirname, 'dist/logic-programming/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (loadingWindow) {
      loadingWindow.close();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function updateProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (loadingWindow) {
      loadingWindow.webContents.send('progress-update', progress);
    }
    if (progress >= 100) {
      clearInterval(interval);
      createMainWindow();
    }
  }, 300);
}

app.on('ready', () => {
  createLoadingWindow();
  updateProgress();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoadingWindow();
    updateProgress();
  }
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
