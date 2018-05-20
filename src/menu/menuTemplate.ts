import { app, BrowserWindow, dialog, shell } from "electron";

const toggleMessage = "User has toggled Play/Pause";
const jumpBackwardsMessage = "User wants to rewind";

export const template = [
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall",
      },
      {
        type: "separator",
      },
      {
        label: "Insert Current Time",
        accelerator: "CmdOrCtrl+;",
        click: (window: Electron.BrowserWindow) => {
          window.webContents.send("insert-current-time", "clicked");
        },
      },
      {
        label: "Toggle Play/Pause",
        accelerator: "Tab",
        click: (window: Electron.BrowserWindow) => {
          window.webContents.send(toggleMessage);
        },
      },
      {
        label: "Skip Backward in Time",
        accelerator: "Shift+Tab",
        click: (window: Electron.BrowserWindow) => {
          window.webContents.send(jumpBackwardsMessage);
        },
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle Full Screen",
        accelerator: (() => {
          if (process.platform === "darwin") {
            return "Ctrl+Command+F";
          } else {
            return "F11";
          }
        })(),
        click(focusedWindow: BrowserWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (() => {
          if (process.platform === "darwin") {
            return "Alt+Command+I";
          } else {
            return "Ctrl+Shift+I";
          }
        })(),
        click(item, focusedWindow: Electron.WebContents) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
      {
        type: "separator",
      },
      {
        label: "App Menu Demo",
        click(item, focusedWindow) {
          if (focusedWindow) {
            const options = {
              type: "info",
              title: "Application Menu Demo",
              buttons: ["Ok"],
              message:
                "Shows how to create a clickable menu item in the application menu.",
            };
            dialog.showMessageBox(focusedWindow, options);
          }
        },
      },
    ],
  },
  {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close",
      },
      {
        type: "separator",
      },
      {
        label: "Reopen Window",
        accelerator: "CmdOrCtrl+Shift+T",
        enabled: false,
        key: "reopenMenuItem",
        click() {
          app.emit("activate");
        },
      },
    ],
  },
  {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          shell.openExternal("http://electron.atom.io");
        },
      },
    ],
  },
] as Electron.MenuItemConstructorOptions[];

function addUpdateMenuItems(items, position) {
  if (process.mas) {
    return;
  }

  const version = app.getVersion();
  const updateItems = [
    {
      label: `Version ${version}`,
      enabled: false,
    },
    {
      label: "Checking for Update",
      enabled: false,
      key: "checkingForUpdate",
    },
    {
      label: "Check for Update",
      visible: false,
      key: "checkForUpdate",
      click() {
        require("electron").autoUpdater.checkForUpdates();
      },
    },
    {
      label: "Restart and Install Update",
      enabled: true,
      visible: false,
      key: "restartToUpdate",
      click() {
        require("electron").autoUpdater.quitAndInstall();
      },
    },
  ];

  items.splice.apply(items, [position, 0].concat(updateItems));
}

if (process.platform === "darwin") {
  const name = app.getName();
  template.unshift({
    label: "Transcriptase",
    submenu: [
      {
        label: `About ${name}`,
        role: "about",
      },
      {
        type: "separator",
      },
      {
        label: "Services",
        role: "services",
        submenu: [],
      },
      {
        type: "separator",
      },
      {
        label: `Hide ${name}`,
        accelerator: "Command+H",
        role: "hide",
      },
      {
        label: "Hide Others",
        accelerator: "Command+Alt+H",
        role: "hideothers",
      },
      {
        label: "Show All",
        role: "unhide",
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click() {
          app.quit();
        },
      },
    ],
  });

  // Window menu.
  // template[3]!.submenu.push({
  //   type: "separator",
  // }, {
  //   label: "Bring All to Front",
  //   role: "front",
  // });

  addUpdateMenuItems(template[0].submenu, 1);
}

if (process.platform === "win32") {
  const helpMenu = template[template.length - 1].submenu;
  addUpdateMenuItems(helpMenu, 0);
}

// app.on("ready", function () {
//   const menu = Menu.buildFromTemplate(template)
//   Menu.setApplicationMenu(menu)
// })

// app.on("browser-window-created", function () {
//   let reopenMenuItem = findReopenMenuItem()
//   if (reopenMenuItem) reopenMenuItem.enabled = false
// })

// app.on("window-all-closed", function () {
//   let reopenMenuItem = findReopenMenuItem()
//   if (reopenMenuItem) reopenMenuItem.enabled = true
// })