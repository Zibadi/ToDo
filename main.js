const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#222222",
    // autoHideMenuBar: true,
    width: 400,
    height: 635,
    minWidth: 400,
    minHeight: 635,
    maxWidth: 400,
    maxHeight: 635,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.once("ready-to-show", () => {
    win.show();
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
