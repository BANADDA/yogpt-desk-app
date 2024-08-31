const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const express = require('express');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    // Load the React app served by Vite in development
    win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
    win.webContents.openDevTools(); // Enable DevTools in development
  } else {
    // Set up Express server to serve the built React app
    const server = express();
    const port = 3000; // You can choose any available port

    server.use(express.static(path.join(__dirname, 'dist')));

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      win.loadURL(`http://localhost:${port}`);
    });

    // Optionally, enable DevTools in production by pressing F12
    win.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') {
        win.webContents.openDevTools();
      }
    });
  }

  // Additional debugging: log errors
  win.webContents.on('crashed', () => {
    console.error('The window has crashed');
  });

  win.webContents.on('unresponsive', () => {
    console.warn('The window is unresponsive');
  });
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

// const path = require('path');
// const { app, BrowserWindow } = require('electron');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'), // Optional, if you have a preload script
//       contextIsolation: true,  // Better security
//       nodeIntegration: false,  // Better security
//     },
//   });

//   // Load the React app served by Vite
//   win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
