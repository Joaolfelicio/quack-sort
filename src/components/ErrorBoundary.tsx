import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="max-w-md rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-soft dark:border-rose-800/50 dark:bg-rose-900/20">
            <span className="text-5xl">🦆</span>
            <h1 className="mt-4 text-xl font-bold text-rose-900 dark:text-rose-100">Something went wrong</h1>
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-6 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
