import { BrowserWindow, ipcMain } from "electron"
import { closeTheWindow } from "../common/ipcChannelNames"

export const listenForKeyboardShortcutToCloseTheWindow: (window: BrowserWindow) => void = (
  window: BrowserWindow,
) => {
  ipcMain.on(closeTheWindow, () => {
    window.close()
  })
}