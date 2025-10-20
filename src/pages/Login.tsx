/**
 * 로그인 페이지
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      await login(email, password)
      navigate('/') // 로그인 성공 시 홈으로 이동
    } catch (err: any) {
      setLocalError(err.message || '로그인에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            AI펫닥터 병원 관리
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            로그인하여 예약을 관리하세요
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

          <div className="rounded-md shadow-sm -space-y-px">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center">
            <Link
              to="/signup"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              계정이 없으신가요? 회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
