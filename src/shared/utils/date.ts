/**
 * 날짜 유틸리티 함수
 */

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 * UTC 변환 없이 로컬 날짜를 그대로 사용
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * YYYY-MM-DD 문자열을 Date 객체로 변환
 */
export function parseYYYYMMDD(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * 날짜를 한국어 형식으로 포맷 (예: 2025년 1월 25일 (토))
 */
export function formatDateKorean(date: Date | string): string {
  const d = typeof date === 'string' ? parseYYYYMMDD(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}
