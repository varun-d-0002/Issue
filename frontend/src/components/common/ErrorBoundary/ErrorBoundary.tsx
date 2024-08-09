import React, { Component, ErrorInfo, ReactNode } from 'react'

import { Result } from 'antd'

import * as CONSTANT from 'common/constant'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='flex h-screen'>
          <div className='m-auto'>
            <Result status='500' title={CONSTANT.ERROR_SYSTEM_MSG} />
            {/* <div className='p-4 bg-gray-100 rounded'>
              <p className='text-red-400 font-bold'>
                {import.meta.env.MODE !== 'production' && error ? error.toString() : ''}
              </p>
              <p className='text-red-400 whitespace-pre-wrap'>
                {import.meta.env.MODE !== 'production' && errorInfo
                  ? errorInfo?.componentStack || ''
                  : ''}
              </p>
            </div> */}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
