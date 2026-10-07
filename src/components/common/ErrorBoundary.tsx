import React from "react";
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="demo-container">
        <h1>This page couldn’t be displayed.</h1>
        <p className="intro">
          Reload the page to retry. Any in-memory analysis will be cleared.
        </p>
        <a className="primary-button" href="/">
          Return to Home
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
