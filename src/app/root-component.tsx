import React from "react"
import "../styles/app-layout-grid.css"

interface AppLayoutState {}

class AppLayout extends React.Component<{}, AppLayoutState> {
  state: AppLayoutState = {}

  public render() {
    return (
      <div className="grid-container">
        <div id="video-player-container" className="item item1 video-player-container">
          <video id="video-player" className="video-js">
            <source />
          </video>
        </div>
        <div className="item item2 editor-container" data-last-saved-path="">
          <div id="toolbar">
            {/*<button id="timestamp-button">*/}
            {/*<span className="fa fa-clock-o fa-2x" />*/}
            {/*</button>*/}
          </div>
          <div className="transcript-editor" />
        </div>
      </div>
    )
  }
}

export { AppLayout }
