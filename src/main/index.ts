import { showUnsavedChangesDialog } from "../common/closeTheApp";
import { saveFile } from "../common/saveTranscript";
import {
  app,
  BrowserWindow,
  ipcMain as ipc,
  Menu,
} from "electron";

import * as fs from "fs";
import { template as menuTemplate } from "../menu/menuTemplate";
import { registerPlayPauseToggleAsGlobalShortcut } from "./controlPlayback";
import { registerJumpBackNSeconds } from "./controlPlayback";
import * as electronLocalShortcut from "electron-localshortcut";
import { autoUpdater } from "electron-updater";
import * as showFileSelectionDialog from "./showFileSelectionDialog";

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    frame: true,
    title: "Transcriptase",
  });

  app.on("will-quit", () => {
    electronLocalShortcut.unregisterAll(mainWindow);
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // mainWindow.webContents.openDevTools()   // Open the DevTools.

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.webContents.send("user-wants-to-close-the-app");
  });
}

app.on("ready", () => {
  createWindow();
  registerPlayPauseToggleAsGlobalShortcut(mainWindow, electronLocalShortcut.register);
  registerJumpBackNSeconds(mainWindow, electronLocalShortcut.register);
  autoUpdater.checkForUpdatesAndNotify();

  mainWindow.once("ready-to-show", () => {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    mainWindow.show();
  });

});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// File selection
ipc.on("open-file-dialog", (event, roleOfFile) => {
  const file = showFileSelectionDialog(event, roleOfFile);
  if (file) {
    event.sender.send("a-file-was-selected", file.toString(), roleOfFile);
  }
});

ipc.on("read-transcript-from-filepath", (event, filePath) => {
  const transcriptStream = fs.createReadStream(
    filePath.toString(), { encoding: "utf-8" },
  );
  let data = "";

  transcriptStream.on("data", (chunk) => { data += chunk; });
  transcriptStream.on("end", () => {
    event.sender.send("transcript-was-read-from-file", data, filePath.toString());
  });

  // fs.readFile(
  //   filePath.toString(),
  //   "utf-8",
  //   (err, data) => {
  //     if (err) console.log(err)
  //     console.log(data)
  //     event.sender.send("transcript-was-read-from-file", data, filePath.toString())
  //   }
  // )
});

// file saving
ipc.on("save-transcript", (event, transcriptText, lastSavedPath) => {
  saveFile(event, transcriptText, lastSavedPath, mainWindow);
});

ipc.on("show-unsaved-changes-dialog", (event, transcriptEditor, lastSavedPath) => {
  showUnsavedChangesDialog(event, mainWindow, transcriptEditor, lastSavedPath);
});

ipc.on("its-safe-to-close-the-app", (event) => {
  mainWindow.destroy();
});

// global shortcuts

// app.on("ready", () => {
//   globalShortcut.register("CmdOrCtrl+;", function () {
//     console.log(`inserting `)
//   })
// })
