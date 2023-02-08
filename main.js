const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { readFile, writeFile } = require("fs");
const path = require("path");

// Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#222222",
    autoHideMenuBar: true,
    width: 800,
    height: 635,
    // minWidth: 400,
    // minHeight: 635,
    // maxWidth: 400,
    // maxHeight: 635,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  win.webContents.openDevTools();

  win.loadFile("index.html");

  win.webContents.on("did-finish-load", (e) => {
    readFile("Tasks.txt", { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      win.webContents.send("tasks", data);
      console.log("Tasks loaded and sent to client.");
    });
  });
}

ipcMain.on("write", (e, content) => {
  writeFile("Tasks.txt", content, (err) => {
    if (err) {
      console.log(err);
      return;
    }
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
