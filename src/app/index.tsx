// This is the entry point for the renderer process.
//
// Here we disable a few electron settings and mount the root component.
import React from "react"
import ReactDOM from "react-dom"
import { RootComponent } from "./root-component"
import { webFrame } from "electron"
import { css } from "glamor"

import { createVideoPlayer } from "./createVideoPlayer"
import { createTranscriptEditor } from "./createTranscriptEditor"

/**
 * CSS reset
 */
import "glamor/reset"

/**
 * Electron-focused CSS resets
 */
css.global("html, body", {
  // turn off text highlighting
  userSelect: "none",

  // reset the cursor pointer
  cursor: "default",

  // font
  font: "caption",

  // text rendering
  WebkitFontSmoothing: "subpixel-antialiased",
  textRendering: "optimizeLegibility",
})

/**
 * Zooming resets
 */
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

/**
 * Drag and drop resets
 */
document.addEventListener("dragover", event => event.preventDefault())
document.addEventListener("drop", event => event.preventDefault())

// mount the root component
import "../styles/uikit.css"

ReactDOM.render(<RootComponent />, document.getElementById("root"), () => {
  createVideoPlayer()
  createTranscriptEditor()
})
