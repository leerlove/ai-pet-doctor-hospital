/**
 * ErrorBoundary Component
 * - React 에러를 잡아서 처리
 * - 앱 전체 크래시 방지
 */

import { Component, type ReactNode } from 'react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 (Sentry 등과 연동 가능)
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 프로덕션 환경에서는 에러 모니터링 서비스로 전송
    if (import.meta.env.PROD) {
      // 예: Sentry.captureException(error)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              {/* 에러 아이콘 */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                문제가 발생했습니다
              </h2>

              {/* 설명 */}
              <p className="text-gray-600 mb-6">
                예상치 못한 오류가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>

              {/* 에러 메시지 (개발 환경에서만) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
                  <p className="text-sm text-left text-red-800 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={this.handleReset}
                >
                  다시 시도
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => window.location.href = '/'}
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
