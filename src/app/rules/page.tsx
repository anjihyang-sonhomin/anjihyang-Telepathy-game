"use client";

import React, { useState, useEffect } from 'react';

export default function GameRulesPPT() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const green = '#267F53';
  const yellow = '#f9fafb';

  const slides = [
    // Slide 0: 표지
    {
      id: 'cover',
      content: (
        <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: yellow }}>
          <h1 className="text-7xl font-bold mb-6" style={{ color: green }}>공통점을 찾아라!</h1>
          <p className="text-3xl text-gray-600">우리는 통한다</p>
        </div>
      )
    },

    // Slide 1: 게임 소개
    {
      id: 'intro',
      content: (
        <div className="h-full p-10 flex flex-col" style={{ backgroundColor: yellow }}>
          <h2 className="text-5xl font-bold mb-8" style={{ color: green }}>어떤 게임인가요?</h2>

          <div className="flex-1 flex items-center">
            <div className="w-full">
              <p className="text-4xl text-gray-700 leading-relaxed mb-10">
                주제가 주어지면<br/>
                <span className="font-bold" style={{ color: green }}>다른 팀들과 같은 생각</span>을 할수록<br/>
                점수를 얻는 게임입니다
              </p>
              <div
                className="rounded-2xl p-6 text-white inline-block"
                style={{ backgroundColor: green }}
              >
                <p className="text-3xl font-bold">
                  &quot;남들이랑 똑같이 생각해야 이깁니다!&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: 준비물
    {
      id: 'prepare',
      content: (
        <div className="h-full p-10 flex flex-col items-center justify-center" style={{ backgroundColor: yellow }}>
          <h2 className="text-5xl font-bold mb-10" style={{ color: green }}>준비물</h2>

          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center mb-4 bg-white"
              >
                <svg className="w-24 h-24" style={{ color: green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold" style={{ color: green }}>종이 1장</p>
            </div>

            <div className="text-5xl" style={{ color: green }}>+</div>

            <div className="text-center">
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center mb-4 bg-white"
              >
                <svg className="w-24 h-24" style={{ color: green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-3xl font-bold" style={{ color: green }}>펜</p>
            </div>

            <div className="text-5xl" style={{ color: green }}>+</div>

            <div className="text-center">
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center mb-4 bg-white"
              >
                <svg className="w-24 h-24" style={{ color: green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold" style={{ color: green }}>팀워크</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Step 1
    {
      id: 'step1',
      content: (
        <div className="h-full p-10 flex flex-col" style={{ backgroundColor: yellow }}>
          <div className="text-2xl font-bold mb-2" style={{ color: green }}>STEP 1</div>
          <h2 className="text-5xl font-bold mb-8" style={{ color: green }}>키워드 5개 적기</h2>

          <div className="flex-1 flex items-center gap-10">
            <div className="bg-white rounded-2xl p-6 flex-1">
              <div className="text-2xl mb-2" style={{ color: green }}>예시 주제</div>
              <div className="text-4xl font-bold text-gray-800 mb-6">&quot;안지향 팀원 이름&quot;</div>

              <div className="space-y-3">
                {['머니하이', '코치미니', '코치로즈', '호마', '샐리'].map((name, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-3 text-2xl text-white font-medium"
                    style={{ backgroundColor: green }}
                  >
                    {i+1}. {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-center">
              <div>
                <p className="text-4xl text-gray-700 leading-relaxed mb-6">
                  주제에 맞는 답을<br/>
                  종이에 <span className="font-bold" style={{ color: green }}>5개</span> 적어주세요
                </p>
                <div
                  className="rounded-xl p-5 text-white"
                  style={{ backgroundColor: green }}
                >
                  <p className="text-2xl">
                    다른 팀과 겹칠 것 같은 답을<br/>적으시면 됩니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Step 2
    {
      id: 'step2',
      content: (
        <div className="h-full p-10 flex flex-col" style={{ backgroundColor: yellow }}>
          <div className="text-2xl font-bold mb-2" style={{ color: green }}>STEP 2</div>
          <h2 className="text-5xl font-bold mb-8" style={{ color: green }}>키워드 외치기</h2>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="rounded-2xl p-8 mb-8 text-center bg-white"
            >
              <p className="text-2xl mb-2" style={{ color: green }}>1팀 차례</p>
              <p className="text-6xl font-bold text-gray-800">
                &quot;머니하이!&quot;
              </p>
            </div>

            <div className="flex items-center gap-4 text-3xl mb-6">
              <span className="px-5 py-2 rounded-full text-white" style={{ backgroundColor: green }}>1팀</span>
              <span style={{ color: green }}>→</span>
              <span className="px-5 py-2 rounded-full bg-white" style={{ color: green }}>2팀</span>
              <span style={{ color: green }}>→</span>
              <span className="px-5 py-2 rounded-full bg-white" style={{ color: green }}>3팀</span>
              <span style={{ color: green }}>→</span>
              <span className="text-gray-400">...</span>
            </div>

            <p className="text-3xl" style={{ color: green }}>
              순서대로 자기 팀 키워드를 하나씩 외쳐주세요
            </p>
          </div>
        </div>
      )
    },

    // Slide 5: Step 3
    {
      id: 'step3',
      content: (
        <div className="h-full p-10 flex flex-col" style={{ backgroundColor: yellow }}>
          <div className="text-2xl font-bold mb-2" style={{ color: green }}>STEP 3</div>
          <h2 className="text-5xl font-bold mb-2" style={{ color: green }}>같은 키워드를 쓰셨나요?</h2>
          <h2 className="text-5xl font-bold mb-6" style={{ color: green }}>일어나주세요!</h2>

          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-3xl text-gray-600 mb-6">1팀이 &quot;머니하이!&quot;를 외쳤을 때</p>

            <div className="flex gap-3 flex-wrap justify-center mb-6">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(team => (
                <div
                  key={team}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl ${
                    team === 2
                      ? 'bg-white text-gray-400'
                      : 'text-white transform -translate-y-3'
                  }`}
                  style={team !== 2 ? { backgroundColor: green } : {}}
                >
                  {team}팀
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-10 text-2xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded transform -translate-y-1"
                  style={{ backgroundColor: green }}
                ></div>
                <span className="text-gray-700">머니하이를 쓴 팀 → 일어남</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded"></div>
                <span className="text-gray-500">안 쓴 팀 → 앉아계세요</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: 점수 계산 (시각화 개선)
    {
      id: 'scoring',
      content: (
        <div className="h-full p-10 flex flex-col items-center justify-center" style={{ backgroundColor: yellow }}>
          <h2 className="text-5xl font-bold mb-6" style={{ color: green }}>점수 계산 방법</h2>
          <p className="text-3xl text-gray-600 mb-6">&quot;머니하이!&quot;를 외쳤을 때</p>

          {/* 15명 사람 시각화 */}
          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(team => {
              const isStanding = team !== 2;
              return (
                <div key={team} className="flex flex-col items-center">
                  {/* +1 점수 표시 */}
                  {isStanding && (
                    <div
                      className="text-xl font-bold mb-1 text-white px-2 py-1 rounded"
                      style={{ backgroundColor: green }}
                    >
                      +1
                    </div>
                  )}
                  {!isStanding && (
                    <div className="text-xl font-bold mb-1 px-2 py-1 text-gray-400">
                      0
                    </div>
                  )}

                  {/* 사람 아이콘 */}
                  <div
                    className={`flex flex-col items-center transition-all ${
                      isStanding ? '' : 'opacity-40'
                    }`}
                  >
                    {/* 머리 */}
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: isStanding ? green : '#ccc' }}
                    ></div>
                    {/* 몸 */}
                    <div
                      className="w-8 h-14 rounded-t-lg mt-1"
                      style={{ backgroundColor: isStanding ? green : '#ccc' }}
                    ></div>
                  </div>

                  {/* 팀 번호 */}
                  <div className={`text-sm mt-1 ${isStanding ? 'font-bold' : 'text-gray-400'}`} style={{ color: isStanding ? green : undefined }}>
                    {team}팀
                  </div>
                </div>
              );
            })}
          </div>

          {/* 점수 합계 */}
          <div className="flex items-center justify-center gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-2xl text-gray-600 mb-2">일어난 팀</p>
              <p className="text-5xl font-bold" style={{ color: green }}>14팀</p>
            </div>

            <div className="text-5xl" style={{ color: green }}>=</div>

            <div className="rounded-2xl p-6 text-center text-white" style={{ backgroundColor: green }}>
              <p className="text-2xl mb-2">일어난 모든 팀이</p>
              <p className="text-6xl font-bold">+14점</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: 다음 주제로
    {
      id: 'next-topic',
      content: (
        <div className="h-full p-10 flex flex-col" style={{ backgroundColor: yellow }}>
          <h2 className="text-5xl font-bold mb-8" style={{ color: green }}>다음 주제로 넘어갈 때</h2>

          <div className="flex-1 flex items-center justify-center gap-12">
            {/* 줄 그은 키워드 예시 */}
            <div className="bg-white rounded-2xl p-6">
              <div className="text-xl mb-2" style={{ color: green }}>예시</div>
              <div className="text-2xl font-bold text-gray-800 mb-4">&quot;안지향 팀원 이름&quot;</div>

              <div className="space-y-3">
                {['머니하이', '코치미니', '코치로즈', '호마', '샐리'].map((name, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-3 text-xl text-white font-medium relative"
                    style={{ backgroundColor: green }}
                  >
                    <span className="line-through decoration-2">{i+1}. {name}</span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 설명 */}
            <div
              className="rounded-2xl p-10 text-center text-white max-w-md"
              style={{ backgroundColor: green }}
            >
              <p className="text-4xl font-bold mb-6">
                &quot;저희 팀 5개<br/>다 썼습니다!&quot;
              </p>
              <p className="text-2xl" style={{ color: '#FFEBB6' }}>
                어느 팀이든 키워드를<br/>다 사용하시면<br/>그 주제는 종료됩니다
              </p>
              <div
                className="mt-6 rounded-xl p-4 inline-block"
                style={{ backgroundColor: '#FFEBB6' }}
              >
                <p className="text-xl font-bold" style={{ color: green }}>
                  → 다음 주제로 넘어갑니다!
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: 요약
    {
      id: 'summary',
      content: (
        <div className="h-full p-10" style={{ backgroundColor: yellow }}>
          <h2 className="text-5xl font-bold mb-10" style={{ color: green }}>게임 진행 순서</h2>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              '주제가 나오면 키워드 5개를 종이에 적습니다',
              '순서대로 키워드를 외칩니다',
              '같은 키워드를 쓴 팀은 일어납니다',
              '일어난 팀 수만큼 점수를 얻습니다'
            ].map((text, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex items-center gap-6 bg-white"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                  style={{ backgroundColor: green }}
                >
                  {i + 1}
                </div>
                <div className="text-3xl text-gray-700">{text}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div
              className="inline-block rounded-xl px-8 py-5 text-white"
              style={{ backgroundColor: green }}
            >
              <p className="text-3xl font-bold">
                핵심: 다른 팀과 같은 생각을 하면 고득점!
              </p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: 시작
    {
      id: 'start',
      content: (
        <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: yellow }}>
          <h1 className="text-7xl font-bold mb-6" style={{ color: green }}>게임을 시작하겠습니다!</h1>
          <p className="text-4xl text-gray-600">종이와 펜을 준비해주세요</p>
        </div>
      )
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#e8e8e8' }}>
      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden shadow-2xl m-3 rounded-xl">
        {slides[currentSlide].content}

        {/* Slide Counter */}
        <div
          className="absolute top-4 right-4 px-4 py-2 rounded-full text-lg font-medium bg-white"
          style={{ color: green }}
        >
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-3 flex items-center justify-between bg-white mx-3 mb-3 rounded-xl shadow">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-6 py-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-xl font-medium bg-gray-100"
          style={{ color: green }}
        >
          ← 이전
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="h-3 rounded-full transition-all"
              style={{
                backgroundColor: i === currentSlide ? green : '#ddd',
                width: i === currentSlide ? '2.5rem' : '0.75rem'
              }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-6 py-3 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-xl font-medium"
          style={{ backgroundColor: green }}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
