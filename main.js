// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var fs = require("fs")

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })

  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // open url.
  // mainWindow.loadURL("https://jessibuca.com/player-pro.html")

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Attach listener in the main process with the given ID
ipcMain.on('request-playmusic-action', (event, arg) => {
  let files = []
  fs.readdirSync(arg).forEach((file) => {
    var pathname = path.join(arg, file)
    if (!pathname.startsWith('.') && !fs.statSync(pathname).isDirectory()) {
      files.push(pathname)
    }
  })
  event.sender.send('request-playmusic-action-response', files);
});