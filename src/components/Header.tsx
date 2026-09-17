import React from 'react';
import { motion } from 'motion/react';
import { Home, Volume2, VolumeX, Award, BookOpen } from 'lucide-react';
import { ScreenType, GameProgress } from '../types';
import { playSound } from '../utils/audio';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  progress: GameProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBadges: () => void;
  onOpenStory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  progress,
  isMuted,
  onToggleMute,
  onOpenBadges,
  onOpenStory,
}) => {
  const completedCount =
    (progress.songpyeonCompleted ? 1 : 0) +
    (progress.charyeCompleted ? 1 : 0) +
    (progress.quizCompleted ? 1 : 0);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'songpyeon':
        return '🥟 알록달록 송편 빚기';
      case 'charye':
        return '🍎 홍동백서 차례상 퍼즐';
      case 'quiz':
        return '🏮 추석 상식 퀴즈';
      default:
        return '🌕 보름달 토끼와 추석 대모험';
    }
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-amber-300/20 text-white px-4 py-3 sticky top-0 z-40 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Home button or App Logo */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' ? (
            <motion.button
              id="header-home-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playSound('tap');
                onNavigate('home');
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-2xl shadow-md text-sm sm:text-base cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>처음으로</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="보름달">🌕</span>
              <span className="font-jua text-lg sm:text-xl text-amber-200 tracking-wide hidden xs:inline">
                추석 대모험
              </span>
            </div>
          )}

          {/* Current Screen Title on mobile/desktop */}
          <div className="font-jua text-sm sm:text-lg text-amber-100 font-semibold truncate max-w-[180px] sm:max-w-xs">
            {currentScreen !== 'home' && (
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-xl border border-amber-300/30">
                {getScreenTitle()}
              </span>
            )}
          </div>
        </div>

        {/* Right: Sound toggle, Story guide, and Badges */}
        <div className="flex items-center gap-2">
          {/* Chuseok Story button */}
          <motion.button
            id="header-story-button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playSound('tap');
              onOpenStory();
            }}
            title="추석 이야기 알아보기"
            className="flex items-center gap-1 bg-sky-900/80 hover:bg-sky-800 text-sky-200 border border-sky-400/30 px-2.5 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span className="hidden sm:inline">추석 이야기</span>
          </motion.button>

          {/* Badges button with badge count indicator */}
          <motion.button
            id="header-badge-button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playSound('pop');
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-2 rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer transition-all"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">내 뱃지</span>
            <span className="bg-slate-950 text-amber-300 font-bold px-1.5 py-0.5 rounded-full text-xs">
              {completedCount}/3
            </span>
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            id="header-sound-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onToggleMute();
            }}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 cursor-pointer shadow-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
