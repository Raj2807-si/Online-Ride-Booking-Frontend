import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Oops! Something went wrong.</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>We're working on fixing this. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ width: 'auto' }}>Retry Now</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
