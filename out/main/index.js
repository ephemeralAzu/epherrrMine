"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const net = require("net");
const icon = path.join(__dirname, "../../resources/icon.png");
if (process.env.NODE_ENV === "development") {
  console.log("Enabling custom enviroiment");
  require("dotenv").config({ path: `.env.development` });
} else {
  process.env.APP_DIR = process.env.APPDATA + "\\.ephermine\\";
  process.env.BUILD_VERSION = electron.app.getVersion();
  process.env.API_URL = "https://mine.epher.su";
  process.env.UPDATE_CHANNEL = "dev";
  process.env.DEBUG_MODE = "false";
}
if (!process.env.BUILD_VERSION) {
  process.env.BUILD_VERSION = electron.app.getVersion();
}
process.env.UPDATED = electron.app.commandLine.getSwitchValue("updated");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    resizable: false,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.webContents.openDevTools();
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    const pipeArg = process.argv.find((a) => a.startsWith("--pipe="));
    if (pipeArg) notify(pipeArg.split("=")[1]);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function notify(pipe) {
  const client = new net.Socket();
  client.connect(pipe, () => {
    client.write("READY");
    client.end();
  }).on("error", console.error);
}
