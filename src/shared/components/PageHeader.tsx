/**
 * PageHeader Component
 * - 페이지 상단 헤더 (타이틀, 뒤로가기, 홈 버튼)
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from './Button'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  showHome?: boolean
  backTo?: string
}

export function PageHeader({
  title,
  showBack = true,
  showHome = true,
  backTo
}: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* 타이틀 */}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">뒤로가기</span>
              </Button>
            )}

            {showHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHome}
                className="flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">홈</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
