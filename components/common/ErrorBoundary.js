import React from "react";

/**
 * Error Boundary for catching React render errors and displaying a fallback UI.
 * Logs errors and can report to analytics. Use around major sections (e.g. visualizer, quiz).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    if (typeof window !== "undefined" && window.analytics?.track) {
      try {
        window.analytics.track("Error Occurred", {
          error: error?.toString?.(),
          componentStack: errorInfo?.componentStack?.slice(0, 500),
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Analytics track failed:", e);
      }
    }

    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      if (Fallback) {
        return <Fallback error={this.state.error} onRetry={this.handleReload} />;
      }

      return (
      <div
        className="error-boundary-fallback min-h-[200px] flex flex-col items-center justify-center p-8 bg-[#0F3460] border-2 border-[#625EC6] rounded-xl text-center"
        role="alert"
      >
        <h2 className="text-lg font-bold text-[#FFD700] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#E8E8E8] mb-4">
          We encountered an unexpected error. You can try reloading the page.
        </p>
        {process.env.NODE_ENV === "development" && this.state.error && (
          <details className="text-left w-full max-w-xl mb-4">
            <summary className="cursor-pointer text-[#C0C0C0] text-xs">
              Error details
            </summary>
            <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-red-300 overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          </details>
        )}
        <button
          type="button"
          onClick={this.handleReload}
          className="game-button px-6 py-2 bg-[#625EC6] text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
          aria-label="Reload page"
        >
          Reload Page
        </button>
      </div>
    );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
