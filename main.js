const { app, BrowserWindow, ipcMain, webContents } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 400,
    minHeight: 600,
    maxWidth: 600,
    maxHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.webContents.openDevTools();

  win.loadFile("index.html");

  win.webContents.on("did-finish-load", (e) => {
    fs.access("./Tasks.txt", (err) => {
      if (!err) {
        fs.readFile("./Tasks.txt", { encoding: "utf-8" }, (err, data) => {
          win.webContents.send("read", data);
          console.log("Tasks loaded and sent to client.");
        });
      }
    });
  });
}

ipcMain.on("write", (e, content) => {
  fs.writeFile("./Tasks.txt", content, (err) => {
    if (err) throw err;
    console.log("Task added.");
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
