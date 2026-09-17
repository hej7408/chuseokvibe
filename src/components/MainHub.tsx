import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScreenType, GameProgress } from '../types';
import { RabbitCharacter } from './RabbitCharacter';
import { playSound } from '../utils/audio';

interface MainHubProps {
  onNavigate: (screen: ScreenType) => void;
  progress: GameProgress;
}

export const MainHub: React.FC<MainHubProps> = ({ onNavigate, progress }) => {
  const [rabbitQuoteIndex, setRabbitQuoteIndex] = useState(0);

  const rabbitQuotes = [
    '안녕 친구들! 달에서 내려온 보름달 토끼야. 우리 함께 신나는 추석 모험을 떠나볼까?',
    '추석은 온 가족이 모여 한 해의 풍성한 수확에 감사하는 우리나라의 큰 명절이란다!',
    '송편도 빚고 차례상 규칙도 배우면 멋진 추석 대장 뱃지를 받을 수 있어!',
    '달아 달아 밝은 달아~ 올 추석에도 모든 소원이 다 이루어지게 해주렴 🌕',
  ];

  const handleRabbitClick = () => {
    playSound('pop');
    setRabbitQuoteIndex((prev) => (prev + 1) % rabbitQuotes.length);
  };

  const menuItems = [
    {
      id: 'songpyeon' as ScreenType,
      title: '송편 만들기',
      subtitle: '알록달록 쫀득한 송편 빚기',
      description: '흰 쌀가루, 은은한 쑥, 고운 백년초 반죽에 달콤한 깨와 알밤을 넣어 예쁜 송편을 빚어봐요!',
      iconEmoji: '🥟',
      colorBg: 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      imgSrc: 'https://placehold.co/320x200/ecfdf5/047857?text=%EC%86%A1%ED%8E%B8+%EB%B9%9A%EA%B8%B0',
      altText: '소나무 솔잎 위에 가지런히 놓인 흰색, 쑥색, 분홍색 반달 모양 송편과 달콤한 깨 소 일러스트레이션',
      completed: progress.songpyeonCompleted,
      progressText: progress.songpyeonCompleted ? '완성 완료!' : '3개 빚기 도전',
    },
    {
      id: 'charye' as ScreenType,
      title: '차례상 차리기',
      subtitle: '홍동백서 규칙을 배우는 퍼즐',
      description: '붉은 과일은 동쪽(오른쪽), 흰 과일은 서쪽(왼쪽)! 홍동백서 규칙으로 과일 자리를 찾아줘요.',
      iconEmoji: '🍎',
      colorBg: 'bg-rose-50 hover:bg-rose-100/90 border-rose-300',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white',
      imgSrc: 'https://placehold.co/320x200/fff1f2/be123c?text=%ED%99%8D%EB%8F%99%EB%B0%B1%EC%84%9C+%EC%B0%A8%EB%A1%80%EC%83%81',
      altText: '단아한 전통 목제 차례상 위에 동쪽에는 붉은 사과, 서쪽에는 흰 배가 바르게 놓여있는 교육용 삽화',
      completed: progress.charyeCompleted,
      progressText: progress.charyeCompleted ? '예절 마스터!' : '퍼즐 맞추기 도전',
    },
    {
      id: 'quiz' as ScreenType,
      title: '추석 퀴즈',
      subtitle: '초등 눈높이 추석 상식 3문제',
      description: '가배(한가위), 강강술래, 솔잎의 비밀까지! 재미있는 퀴즈를 풀고 축하 폭죽을 터트려봐요!',
      iconEmoji: '🏮',
      colorBg: 'bg-sky-50 hover:bg-sky-100/90 border-sky-300',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      buttonBg: 'bg-sky-600 hover:bg-sky-500 text-white',
      imgSrc: 'https://placehold.co/320x200/f0f9ff/0369a1?text=%EC%B6%94%EC%84%9D+%EC%83%81%EC%8B%9D+%ED%80%B4%EC%A6%88',
      altText: '둥근 보름달 아래에서 아이들이 손을 잡고 강강술래를 하며 즐겁게 퀴즈를 푸는 전통 일러스트레이션',
      completed: progress.quizCompleted,
      progressText: progress.quizCompleted ? '척척박사 완료!' : '퀴즈 3문제 도전',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 px-4 py-6 sm:py-8 flex flex-col justify-between">
      {/* Background Night Sky Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Twinkling Stars */}
        <div className="absolute top-6 left-10 text-yellow-200 text-xs animate-ping">✦</div>
        <div className="absolute top-20 right-16 text-yellow-100 text-sm animate-pulse">✦</div>
        <div className="absolute top-44 left-1/4 text-amber-200 text-xs animate-ping">✦</div>
        <div className="absolute top-16 left-3/4 text-amber-100 text-xs animate-pulse">✦</div>
        <div className="absolute top-32 right-1/3 text-yellow-200 text-xs animate-pulse">✦</div>

        {/* Luminous Full Moon (보름달) with soft traditional halo */}
        <div className="absolute -top-10 right-4 sm:right-16 w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 shadow-[0_0_80px_rgba(253,224,71,0.45)] border-4 border-yellow-100/60 opacity-90">
          {/* Subtle lunar crater silhouette */}
          <div className="absolute top-10 left-10 w-12 h-10 rounded-full bg-amber-200/30 blur-[2px]" />
          <div className="absolute bottom-12 right-12 w-16 h-12 rounded-full bg-amber-200/25 blur-[2px]" />
        </div>

        {/* Soft floating pastel clouds */}
        <motion.div
          animate={{ x: [-20, 30, -20] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-4 w-40 h-10 bg-indigo-300/10 rounded-full blur-sm"
        />
        <motion.div
          animate={{ x: [20, -40, 20] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-24 w-52 h-12 bg-amber-200/10 rounded-full blur-md"
        />

        {/* Traditional Korean Hanok Roof Silhouette at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-20">
          <svg
            className="w-full h-full text-slate-800 preserve-3d"
            viewBox="0 0 1200 200"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,200 L0,150 Q150,110 300,140 Q450,90 600,140 Q750,90 900,140 Q1050,100 1200,150 L1200,200 Z" />
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-5xl mx-auto w-full z-10">
        {/* Title & Banner Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>풍성하고 따뜻한 한가위 맞이 체험 교실</span>
          </div>

          <h1 className="font-jua text-3xl sm:text-5xl text-amber-100 tracking-wide drop-shadow-md">
            보름달 토끼와 함께하는 <span className="text-amber-300">추석 대모험</span>
          </h1>

          <p className="mt-2 text-slate-300 text-sm sm:text-base font-korean max-w-lg mx-auto leading-relaxed">
            우리나라 최대의 명절 추석! 귀여운 달토끼와 함께 송편도 빚고,
            차례상 예절도 배우며 신나는 모험을 시작해 볼까요?
          </p>
        </div>

        {/* Central Rabbit Guide Section */}
        <div className="mb-8 flex justify-center">
          <RabbitCharacter
            message={rabbitQuotes[rabbitQuoteIndex]}
            mood="happy"
            size="md"
            onRabbitClick={handleRabbitClick}
          />
        </div>

        {/* 3 Main Activity Menu Cards (Tactile, large, responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              id={`menu-card-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className={`rounded-3xl p-5 border-2 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all cursor-pointer ${item.colorBg}`}
              onClick={() => {
                playSound('tap');
                onNavigate(item.id);
              }}
            >
              <div>
                {/* Image with Placeholder & Alt description as required */}
                <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 border border-slate-200/80 shadow-sm relative group">
                  <img
                    src={item.imgSrc}
                    alt={item.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold font-jua border border-slate-200 shadow-sm flex items-center gap-1">
                    <span>{item.iconEmoji}</span>
                    <span>활동 {index + 1}</span>
                  </div>

                  {item.completed && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>완료!</span>
                    </div>
                  )}
                </div>

                {/* Card Title & Subtitle */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h2 className="font-jua text-xl sm:text-2xl text-slate-800 tracking-wide flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </h2>
                </div>

                <div className="text-xs font-semibold text-slate-600 mb-2 font-korean">
                  {item.subtitle}
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 font-korean line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Action Big Button */}
              <div className="pt-2 border-t border-slate-300/40 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {item.progressText}
                </span>

                <div
                  className={`flex items-center gap-1.5 font-jua text-sm sm:text-base px-4 py-2.5 rounded-2xl shadow-md transition-all ${item.buttonBg}`}
                >
                  <span>{item.completed ? '다시 하기' : '시작하기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Proverb & Tradition Note */}
      <div className="relative mt-8 text-center text-xs sm:text-sm text-amber-200/80 font-korean z-10">
        <span className="bg-slate-900/60 px-4 py-2 rounded-full border border-amber-300/20 backdrop-blur-sm inline-block">
          🌾 &ldquo;더도 말고 덜도 말고 늘 한가위만 같아라&rdquo; — 풍성하고 따뜻한 추석 명절 보내세요!
        </span>
      </div>
    </div>
  );
};
