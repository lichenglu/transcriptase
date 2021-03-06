import React from "react"
import "./styles/app-layout-grid.css"
import "./styles/uikit.css"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { PlayerContainer } from "./components/videoContainer"
import { MarkdownPreviewEditor as Editor } from "./components/editorContainer"
import ReactDOM from "react-dom"

interface AppLayoutState {
  pathToMedia: string
}

interface AppLayoutProps {}

export class AppLayout extends React.Component<AppLayoutProps, AppLayoutState> {
  constructor(props: AppLayoutProps) {
    super(props)
  }

  public render() {
    return (
      <div className="grid-container">
        <ErrorBoundary>
          <PlayerContainer />
        </ErrorBoundary>
        <div className="uk-card uk-overflow-auto uk-card-default">
          <div
            className="uk-card-body uk-overflow-auto editor-container"
            id="editor-card"
            color="black"
            // padding="5%"
          >
            <ErrorBoundary>
              <Editor />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    )
  }
}

export const renderRoot = () => {
  ReactDOM.render(
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>,
    document.getElementById("app"),
    () => {},
  )
}
