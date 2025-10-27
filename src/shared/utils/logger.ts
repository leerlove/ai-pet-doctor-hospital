/**
 * Logger 유틸리티
 * - 개발 환경에서는 모든 로그 출력
 * - 프로덕션 환경에서는 에러만 출력
 */

const isDev = import.meta.env.DEV

export const logger = {
  /**
   * 일반 정보 로그 (개발 환경에서만)
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`ℹ️ ${message}`, ...args)
    }
  },

  /**
   * 성공 로그 (개발 환경에서만)
   */
  success: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`✅ ${message}`, ...args)
    }
  },

  /**
   * 경고 로그 (모든 환경)
   */
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`⚠️ ${message}`, ...args)
  },

  /**
   * 에러 로그 (모든 환경)
   */
  error: (message: string, ...args: unknown[]) => {
    console.error(`❌ ${message}`, ...args)
  },

  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(`🔍 ${message}`, ...args)
    }
  },

  /**
   * 구조화된 로그 (개발 환경에서만)
   */
  table: (data: unknown) => {
    if (isDev && console.table) {
      console.table(data)
    }
  },

  /**
   * 그룹 로그 시작 (개발 환경에서만)
   */
  group: (label: string) => {
    if (isDev) {
      console.group(label)
    }
  },

  /**
   * 그룹 로그 종료 (개발 환경에서만)
   */
  groupEnd: () => {
    if (isDev) {
      console.groupEnd()
    }
  },
}

/**
 * 에러 객체를 안전하게 문자열로 변환
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return '알 수 없는 오류가 발생했습니다'
}

/**
 * API 에러 로깅 헬퍼
 */
export function logApiError(operation: string, error: unknown) {
  logger.error(`API 오류 [${operation}]`)
  logger.error('에러 메시지:', getErrorMessage(error))

  if (isDev && error && typeof error === 'object') {
    logger.debug('전체 에러 객체:', error)
  }
}
