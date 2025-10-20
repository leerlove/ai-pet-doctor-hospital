/**
 * 디자인 컨셉 6: Clean Booking System (벤치마킹 기반)
 * - Teal/Green 계열 색상
 * - 카드 기반 깔끔한 레이아웃
 * - 예약 중심 디자인
 * - 달력과 시간 선택 UI 강조
 */

import { useState } from 'react'

export default function Concept6_CleanBooking() {
  const [selectedDate, setSelectedDate] = useState(14)
  const [selectedTime, setSelectedTime] = useState('14:00')

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ]

  const calendarDays = [
    null, null, null, null, null, null, 1,
    2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29,
    30, 31
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI펫닥터</h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-teal-600">예약하기</a>
              <a href="#" className="text-sm text-gray-600 hover:text-teal-600">내 예약</a>
              <a href="#" className="text-sm text-gray-600 hover:text-teal-600">로그인</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-teal-600">홈</a>
          <span>›</span>
          <span className="text-gray-900 font-medium">예약하기</span>
        </div>

        {/* Booking Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">김</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">김수진</h2>
                  <p className="text-sm text-gray-500">고객</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900">재학생 전공 선택 상담</h3>

                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  1시간
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  행복 동물병원
                </div>
              </div>

              {/* Date Selection Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">날짜를 선택해주세요.</h4>
                <p className="text-sm text-gray-600 mb-4">2021년 5월</p>

                {/* Mini Calendar Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">선택된 날짜</span>
                  </div>
                  <div className="text-lg font-bold text-teal-600">5월 {selectedDate}일 금요일</div>
                  <div className="text-sm text-gray-600 mt-1">{selectedTime}</div>
                </div>
              </div>

              {/* Available Time Notice */}
              <div className="mt-6 flex items-start space-x-2 bg-teal-50 rounded-lg p-3">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-teal-900">되는시간</p>
                  <p className="text-xs text-teal-700 mt-1">으로 이번 예약 페이지입니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">날짜를 선택해주세요.</h3>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">2021년 5월</h4>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${!day ? 'invisible' : ''}
                        ${day === selectedDate
                          ? 'bg-teal-600 text-white shadow-lg scale-105'
                          : day && day >= 12 && day <= 31
                            ? 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                            : 'text-gray-300 cursor-not-allowed'
                        }
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone */}
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center justify-between w-full text-sm text-teal-600 hover:text-teal-700">
                  <span className="font-medium">시간대: 대한민국</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  로그인하여 내가 가능한 시간 표시
                </p>
                <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1 inline-block">
                  되는시간 로그인 →
                </a>
              </div>
            </div>
          </div>

          {/* Right - Time Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">시간 선택</h3>
              <p className="text-sm text-gray-600 mb-4">5월 {selectedDate}일 금요일</p>

              {/* Time Slots */}
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition-all text-left
                      ${selectedTime === time
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{time}</span>
                      {selectedTime === time && (
                        <span className="text-xs bg-white text-teal-600 px-2 py-1 rounded">
                          확인
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">예약을 확정하시겠습니까?</h3>
              <p className="text-sm text-gray-600 mt-1">
                5월 {selectedDate}일 금요일 {selectedTime}
              </p>
            </div>
            <button className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl">
              예약 확정하기
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-sm text-gray-600">© 2025 AI펫닥터. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-teal-600">서비스 소개</a>
              <a href="#" className="text-gray-600 hover:text-teal-600">이용약관</a>
              <a href="#" className="text-gray-600 hover:text-teal-600">개인정보처리방침</a>
              <a href="#" className="text-gray-600 hover:text-teal-600">고객센터</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
