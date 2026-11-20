import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-mist px-4">
          <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-card">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-xl font-bold text-navy-900">Something went wrong</h1>
            <p className="mt-2 text-sm leading-relaxed text-body/70">
              The page could not be displayed. Please reload the page. If the issue continues, contact us directly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => window.location.reload()} className="btn-primary">
                Reload page
              </button>
              <a href="/" className="btn-outline">Go to homepage</a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
