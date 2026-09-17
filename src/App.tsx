/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, GameProgress } from './types';
import { Header } from './components/Header';
import { MainHub } from './components/MainHub';
import { SongpyeonGame } from './components/SongpyeonGame';
import { CharyePuzzleGame } from './components/CharyePuzzleGame';
import { ChuseokQuiz } from './components/ChuseokQuiz';
import { BadgeModal } from './components/BadgeModal';
import { ChuseokStoryModal } from './components/ChuseokStoryModal';
import { toggleMute, getMuteState, playSound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isMuted, setIsMuted] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Game progress state
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem('chuseok_game_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore local storage error
    }
    return {
      songpyeonCompleted: false,
      charyeCompleted: false,
      quizCompleted: false,
      songpyeonCount: 0,
      quizScore: 0,
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('chuseok_game_progress', JSON.stringify(progress));
    } catch {
      // Ignore local storage error
    }
  }, [progress]);

  const handleToggleMute = () => {
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleNavigate = (screen: ScreenType) => {
    playSound('tap');
    setCurrentScreen(screen);
  };

  const handleSongpyeonComplete = () => {
    setProgress((prev) => ({
      ...prev,
      songpyeonCompleted: true,
      songpyeonCount: prev.songpyeonCount + 3,
    }));
  };

  const handleCharyeComplete = () => {
    setProgress((prev) => ({
      ...prev,
      charyeCompleted: true,
    }));
  };

  const handleQuizComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizCompleted: true,
      quizScore: Math.max(prev.quizScore, score),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation & Status Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        progress={progress}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onOpenStory={() => setIsStoryModalOpen(true)}
      />

      {/* Main Dynamic View with AnimatePresence */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="screen-home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <MainHub onNavigate={handleNavigate} progress={progress} />
            </motion.div>
          )}

          {currentScreen === 'songpyeon' && (
            <motion.div
              key="screen-songpyeon"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <SongpyeonGame
                onComplete={handleSongpyeonComplete}
                onNavigateHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}

          {currentScreen === 'charye' && (
            <motion.div
              key="screen-charye"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <CharyePuzzleGame
                onComplete={handleCharyeComplete}
                onNavigateHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}

          {currentScreen === 'quiz' && (
            <motion.div
              key="screen-quiz"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <ChuseokQuiz
                onComplete={handleQuizComplete}
                onNavigateHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Badges Modal */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        progress={progress}
      />

      {/* Chuseok Story Modal */}
      <ChuseokStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </div>
  );
}
