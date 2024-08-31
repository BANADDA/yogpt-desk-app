const path = require('path');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional, if you have a preload script
      contextIsolation: true,  // Better security
      nodeIntegration: false,  // Better security
    },
  });

  // Load the React app served by Vite
  win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
