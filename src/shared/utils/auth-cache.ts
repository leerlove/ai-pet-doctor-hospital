/**
 * 인증 캐시 관리 유틸리티
 * - 브라우저 캐시와 세션 동기화
 * - 로그아웃 시 완전한 정리
 */

/**
 * Supabase 세션 키 생성
 */
function getSupabaseSessionKey(): string {
  const url = import.meta.env.VITE_SUPABASE_URL
  if (!url) return ''
  
  const projectId = url.split('//')[1]?.split('.')[0]
  return `sb-${projectId}-auth-token`
}

/**
 * 모든 인증 관련 데이터 정리
 */
export function clearAuthCache(): void {
  try {
    // Zustand store 데이터 정리
    localStorage.removeItem('auth-storage')
    
    // Supabase 세션 데이터 정리
    const sessionKey = getSupabaseSessionKey()
    if (sessionKey) {
      localStorage.removeItem(sessionKey)
    }
    
    // 기타 Supabase 관련 키들 정리
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.includes('auth')) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('인증 캐시 정리 완료')
  } catch (error) {
    console.error('인증 캐시 정리 실패:', error)
  }
}

/**
 * 세션 유효성 검사
 */
export function isSessionValid(session: any): boolean {
  if (!session) return false
  
  const now = Math.floor(Date.now() / 1000)
  return session.expires_at && session.expires_at > now
}

/**
 * 브라우저 새로고침 (캐시 무시)
 */
export function hardRefresh(): void {
  // 캐시를 무시하고 새로고침
  window.location.reload()
}

/**
 * 디버그: 현재 저장된 인증 데이터 확인
 */
export function debugAuthCache(): void {
  console.log('=== 인증 캐시 디버그 ===')

  // Zustand store 데이터
  const authStorage = localStorage.getItem('auth-storage')
  console.log('Zustand auth-storage:', authStorage ? JSON.parse(authStorage) : null)

  // Supabase 세션 데이터
  const sessionKey = getSupabaseSessionKey()
  const supabaseSession = sessionKey ? localStorage.getItem(sessionKey) : null
  console.log('Supabase session:', supabaseSession ? JSON.parse(supabaseSession) : null)

  // 모든 Supabase 관련 키들
  const keys = Object.keys(localStorage).filter(key => key.startsWith('sb-'))
  console.log('Supabase keys:', keys)

  console.log('========================')
}

// 개발 환경에서 전역 함수로 노출 (DOM 로드 후 실행)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // window 객체가 완전히 로드된 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ;(window as any).debugAuthCache = debugAuthCache
      ;(window as any).clearAuthCache = clearAuthCache
    })
  } else {
    ;(window as any).debugAuthCache = debugAuthCache
    ;(window as any).clearAuthCache = clearAuthCache
  }
}
