/**
 * 회원가입 페이지
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Signup() {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fullName, setFullName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // 유효성 검사
    if (!email || !password || !passwordConfirm) {
      setLocalError('모든 필드를 입력해주세요.')
      return
    }

    if (password !== passwordConfirm) {
      setLocalError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setLocalError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    try {
      await register(email, password, fullName)
      navigate('/') // 회원가입 성공 시 홈으로 이동
    } catch (err: any) {
      setLocalError(err.message || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            AI펫닥터 병원 관리 시스템
          </p>
        </div>

        {/* 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 에러 메시지 */}
          {(error || localError) && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{localError || error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 이름 */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="홍길동"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="최소 6자"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인 *
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="비밀번호 재입력"
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </div>

          {/* 로그인 링크 */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
