import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Check, ArrowRight, Award } from 'lucide-react';
import { DoughType, FillingType, MadeSongpyeon } from '../types';
import { playSound } from '../utils/audio';

interface SongpyeonGameProps {
  onComplete: () => void;
  onNavigateHome: () => void;
}

const DOUGHS: DoughType[] = [
  {
    id: 'white',
    name: '하얀 쌀반죽',
    colorName: '백색(白)',
    bgColor: 'bg-white',
    borderClass: 'border-slate-300 shadow-slate-200',
    badgeBg: 'bg-slate-100 text-slate-800',
    description: '햇쌀을 곱게 빻아 만든 뽀얗고 쫄깃한 기본 반죽',
    flavor: '담백하고 쫄깃한 쌀맛',
    placeholderImg: 'https://placehold.co/120x120/ffffff/64748b?text=%ED%9D%B0+%EB%B0%98%EC%A3%BD',
    altDescription: '햅쌀가루로 둥글납작하게 빚은 깨끗한 흰색 쌀가루 송편 반죽',
  },
  {
    id: 'mugwort',
    name: '향긋한 쑥반죽',
    colorName: '청색/초록(靑)',
    bgColor: 'bg-emerald-600 text-white',
    borderClass: 'border-emerald-700 shadow-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-900',
    description: '봄철 어린 쑥을 삶아 찧어 은은한 향이 감도는 건강한 반죽',
    flavor: '쌉싸름하고 향긋한 쑥향',
    placeholderImg: 'https://placehold.co/120x120/059669/ffffff?text=%EC%87%A5+%EB%B0%98%EC%A3%BD',
    altDescription: '푸릇푸릇하고 건강한 어린 쑥을 넣어 반죽한 짙은 초록빛 쑥송편 반죽',
  },
  {
    id: 'pink',
    name: '고운 분홍반죽',
    colorName: '적색/분홍(赤)',
    bgColor: 'bg-pink-400 text-white',
    borderClass: 'border-pink-500 shadow-pink-200',
    badgeBg: 'bg-pink-100 text-pink-900',
    description: '붉은 백년초와 오미자 즙으로 물들인 화사하고 고운 반죽',
    flavor: '달콤상큼 은은한 향미',
    placeholderImg: 'https://placehold.co/120x120/f472b6/ffffff?text=%EB%B6%84%ED%99%8D+%EB%B0%98%EC%A3%BD',
    altDescription: '붉은 백년초 열매 즙을 물들여 만든 화사한 파스텔 분홍빛 송편 반죽',
  },
];

const FILLINGS: FillingType[] = [
  {
    id: 'sesame',
    name: '달콤한 깨+설탕',
    emoji: '🍯',
    bgColor: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeBg: 'bg-amber-200 text-amber-900',
    description: '볶은 참깨와 달콤한 설탕을 섞어 한 입 베어 물면 꿀맛!',
    taste: '달콤고소 꿀맛 깨소',
    placeholderImg: 'https://placehold.co/100x100/fef3c7/b45309?text=%EA%B9%A8%EC%86%8C',
    altDescription: '볶은 참깨에 황설탕과 꿀을 버무린 달콤하고 고소한 송편 속재료 깨소',
  },
  {
    id: 'chestnut',
    name: '고소한 알밤',
    emoji: '🌰',
    bgColor: 'bg-orange-100 text-orange-900 border-orange-300',
    badgeBg: 'bg-orange-200 text-orange-900',
    description: '가을 햇밤을 깎아 포슬포슬 달콤하게 익힌 알밤 속재료',
    taste: '부드럽고 포슬포슬한 밤맛',
    placeholderImg: 'https://placehold.co/100x100/ffedd5/c2410c?text=%EC%95%8C%EB%B0%A4',
    altDescription: '노랗고 통통하게 잘 익은 가을 햇밤을 조각내어 준비한 송편 알밤 속재료',
  },
  {
    id: 'bean',
    name: '담백한 풋콩',
    emoji: '🫘',
    bgColor: 'bg-lime-100 text-lime-900 border-lime-300',
    badgeBg: 'bg-lime-200 text-lime-900',
    description: '밭에서 갓 딴 햇콩을 삶아 영양 듬뿍 고소하고 담백한 맛',
    taste: '담백하고 영양만점 콩맛',
    placeholderImg: 'https://placehold.co/100x100/ecfccb/4d7c0f?text=%ED%95%AB%EC%BD%A9',
    altDescription: '연한 초록빛과 검은콩을 삶아 준비한 영양 가득 담백한 송편 콩 속재료',
  },
];

export const SongpyeonGame: React.FC<SongpyeonGameProps> = ({
  onComplete,
  onNavigateHome,
}) => {
  const [selectedDough, setSelectedDough] = useState<DoughType | null>(DOUGHS[0]);
  const [selectedFilling, setSelectedFilling] = useState<FillingType | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingStep, setCraftingStep] = useState<1 | 2 | 3>(1);
  const [completedSongpyeons, setCompletedSongpyeons] = useState<MadeSongpyeon[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [draggedFilling, setDraggedFilling] = useState<FillingType | null>(null);

  // Trigger songpyeon crafting animation sequence
  const startCrafting = (dough: DoughType, filling: FillingType) => {
    if (isCrafting) return;
    setIsCrafting(true);
    playSound('pop');
    setCraftingStep(1); // 1: Dough Flattening / Shaping

    setTimeout(() => {
      playSound('pop');
      setCraftingStep(2); // 2: Filling Drop Inside
    }, 700);

    setTimeout(() => {
      playSound('sparkle');
      setCraftingStep(3); // 3: Half-moon folding & Pine Needle garnish
    }, 1400);

    setTimeout(() => {
      playSound('success');
      const newSongpyeon: MadeSongpyeon = {
        id: `songpyeon-${Date.now()}`,
        dough,
        filling,
        madeAt: new Date(),
      };

      const updated = [...completedSongpyeons, newSongpyeon];
      setCompletedSongpyeons(updated);
      setIsCrafting(false);
      setSelectedFilling(null);

      // Check if 3 songpyeons are made
      if (updated.length >= 3) {
        playSound('complete');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34D399', '#FBBF24', '#F472B6', '#60A5FA'],
        });
        setShowCelebration(true);
        onComplete();
      }
    }, 2200);
  };

  // Drag and Drop handlers
  const handleDragStart = (filling: FillingType) => {
    setDraggedFilling(filling);
    playSound('tap');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDough = (targetDough: DoughType) => {
    if (draggedFilling) {
      startCrafting(targetDough, draggedFilling);
      setDraggedFilling(null);
    }
  };

  const handleReset = () => {
    playSound('tap');
    setCompletedSongpyeons([]);
    setShowCelebration(false);
    setSelectedFilling(null);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 px-4 py-6 text-slate-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header Guide */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>미니게임 1: 알록달록 송편 빚기</span>
          </div>

          <h1 className="font-jua text-2xl sm:text-4xl text-emerald-100 drop-shadow">
            맛있는 속을 넣어 <span className="text-amber-300">송편 3개</span>를 빚어봐요!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-korean mt-1">
            속재료를 반죽 위로 <span className="text-amber-300 font-bold">드래그</span>하거나,
            반죽과 속재료를 <span className="text-amber-300 font-bold">클릭</span>해서 오물조물 예쁜 반달 송편을 만들어보세요!
          </p>

          {/* Progress Tracker (3 goals) */}
          <div className="mt-3 flex items-center justify-center gap-3">
            {[0, 1, 2].map((idx) => {
              const isMade = completedSongpyeons.length > idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-jua transition-all ${
                    isMade
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md scale-105'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <span>{isMade ? '🥟 완성!' : `송편 ${idx + 1}`}</span>
                  {isMade && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Layout: Left (Doughs) | Center (Crafting Mat / Animation) | Right (Fillings) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: Dough Selection (Col 1-4) */}
          <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-jua text-lg sm:text-xl text-emerald-200 flex items-center gap-1.5">
                <span>1. 고운 반죽 고르기</span>
              </h2>
              <span className="text-xs text-slate-400 font-korean">클릭 또는 드롭</span>
            </div>

            <div className="space-y-3">
              {DOUGHS.map((dough) => {
                const isSelected = selectedDough?.id === dough.id;
                return (
                  <motion.div
                    key={dough.id}
                    id={`dough-${dough.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnDough(dough)}
                    onClick={() => {
                      playSound('tap');
                      setSelectedDough(dough);
                      if (selectedFilling) {
                        startCrafting(dough, selectedFilling);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-amber-400 bg-slate-700/90 shadow-lg ring-2 ring-amber-400/50'
                        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/50'
                    }`}
                  >
                    {/* Dough Visual Representation */}
                    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-slate-600 shadow-inner">
                      <img
                        src={dough.placeholderImg}
                        alt={dough.altDescription}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-0.5">
                        <span className="text-[10px] font-bold text-white font-jua">
                          {dough.colorName}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-jua text-base sm:text-lg text-slate-100 truncate">
                          {dough.name}
                        </h3>
                        {isSelected && (
                          <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-full font-jua">
                            선택됨
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-korean line-clamp-1 mt-0.5">
                        {dough.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CENTER: Crafting Animation Mat (Col 5-8) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            {/* The Traditional Cutting Board / Bamboo Steamer Mat */}
            <div
              onDragOver={handleDragOver}
              onDrop={() => {
                if (selectedDough && draggedFilling) {
                  startCrafting(selectedDough, draggedFilling);
                  setDraggedFilling(null);
                }
              }}
              className="w-full bg-gradient-to-b from-amber-100 to-amber-200 text-slate-900 rounded-3xl p-5 border-4 border-amber-600/60 shadow-2xl relative min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-between overflow-hidden"
            >
              {/* Pine Needle Texture Background (솔잎 장식) */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap gap-4 p-4 text-emerald-800 text-2xl select-none">
                <span>🌿</span><span>🌾</span><span>🌿</span><span>🌾</span><span>🌿</span>
                <span>🌾</span><span>🌿</span><span>🌾</span><span>🌿</span><span>🌾</span>
              </div>

              {/* Mat Header */}
              <div className="relative z-10 w-full flex items-center justify-between border-b border-amber-400/40 pb-2">
                <span className="font-jua text-sm sm:text-base text-amber-900 flex items-center gap-1">
                  🌿 <span>솔잎 깔린 송편 도마</span>
                </span>
                <span className="text-xs bg-amber-300/80 px-2 py-0.5 rounded-full text-amber-950 font-bold font-korean">
                  {isCrafting ? '빚는 중...' : '재료를 올려주세요'}
                </span>
              </div>

              {/* Crafting Interactive Stage */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center min-h-[160px]">
                {isCrafting ? (
                  <div className="flex flex-col items-center text-center">
                    <AnimatePresence mode="wait">
                      {craftingStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0], opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-24 h-24 rounded-full shadow-xl flex items-center justify-center text-3xl border-4 ${
                              selectedDough?.id === 'white'
                                ? 'bg-white border-slate-300 text-slate-700'
                                : selectedDough?.id === 'mugwort'
                                ? 'bg-emerald-600 border-emerald-800 text-white'
                                : 'bg-pink-400 border-pink-600 text-white'
                            }`}
                          >
                            👐
                          </div>
                          <span className="mt-3 font-jua text-base text-amber-950 bg-amber-300/90 px-3 py-1 rounded-full shadow-sm">
                            조물조물 반죽 둥글리기...
                          </span>
                        </motion.div>
                      )}

                      {craftingStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ scale: 0.8, y: -20, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <div className="relative w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-lg">
                            <span className="animate-bounce">
                              {selectedFilling?.emoji || '🍯'}
                            </span>
                          </div>
                          <span className="mt-3 font-jua text-base text-amber-950 bg-amber-300/90 px-3 py-1 rounded-full shadow-sm">
                            달콤한 {selectedFilling?.name} 속 넣기!
                          </span>
                        </motion.div>
                      )}

                      {craftingStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-28 h-16 rounded-t-full shadow-2xl border-4 flex items-center justify-center relative ${
                              selectedDough?.id === 'white'
                                ? 'bg-white border-slate-300'
                                : selectedDough?.id === 'mugwort'
                                ? 'bg-emerald-600 border-emerald-800'
                                : 'bg-pink-400 border-pink-600'
                            }`}
                          >
                            <span className="text-xl">🌿</span>
                          </div>
                          <span className="mt-3 font-jua text-base text-amber-950 bg-amber-300/90 px-3 py-1 rounded-full shadow-sm">
                            솔잎 향 솔솔~ 예쁜 반달 송편 완성!
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="flex flex-col items-center text-center p-3"
                  >
                    {/* Active preview dough */}
                    {selectedDough ? (
                      <div
                        className={`w-24 h-24 rounded-full shadow-lg border-4 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                          selectedDough.id === 'white'
                            ? 'bg-white border-slate-300 text-slate-700'
                            : selectedDough.id === 'mugwort'
                            ? 'bg-emerald-600 border-emerald-800 text-white'
                            : 'bg-pink-400 border-pink-600 text-white'
                        }`}
                      >
                        <span className="text-xs font-jua font-bold">
                          {selectedDough.colorName}
                        </span>
                        <span className="text-2xl mt-0.5">🌾</span>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-dashed border-amber-600/40 flex items-center justify-center text-amber-800/60 font-jua text-sm">
                        반죽 선택
                      </div>
                    )}

                    <div className="mt-3 text-xs sm:text-sm font-jua text-amber-950 bg-amber-300/70 px-3 py-1 rounded-xl shadow-xs">
                      👉 오른쪽의 <span className="font-bold text-amber-900">속재료</span>를 드래그하거나 눌러주세요!
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mat Footer status */}
              <div className="relative z-10 w-full text-center text-xs text-amber-900/80 font-korean">
                선택된 반죽: <strong className="text-amber-950">{selectedDough?.name || '없음'}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: Filling Selection (Col 9-12) */}
          <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-jua text-lg sm:text-xl text-emerald-200 flex items-center gap-1.5">
                <span>2. 맛있는 속재료 넣기</span>
              </h2>
              <span className="text-xs text-slate-400 font-korean">드래그 가능</span>
            </div>

            <div className="space-y-3">
              {FILLINGS.map((filling) => {
                const isSelected = selectedFilling?.id === filling.id;
                return (
                  <motion.div
                    key={filling.id}
                    id={`filling-${filling.id}`}
                    draggable={!isCrafting}
                    onDragStart={() => handleDragStart(filling)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      playSound('tap');
                      setSelectedFilling(filling);
                      if (selectedDough) {
                        startCrafting(selectedDough, filling);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-amber-400 bg-slate-700/90 shadow-lg ring-2 ring-amber-400/50'
                        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/50'
                    }`}
                  >
                    {/* Filling Visual Representation */}
                    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-slate-600 shadow-inner">
                      <img
                        src={filling.placeholderImg}
                        alt={filling.altDescription}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 text-base drop-shadow">
                        {filling.emoji}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-jua text-base sm:text-lg text-slate-100 truncate">
                          {filling.name}
                        </h3>
                        <span className="text-xs bg-slate-700 text-amber-300 font-jua px-2 py-0.5 rounded-full">
                          {filling.taste}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-korean line-clamp-1 mt-0.5">
                        {filling.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM: Steamer Platter with Completed Songpyeons */}
        <div className="mt-8 bg-slate-800/90 backdrop-blur-md rounded-3xl p-5 border-2 border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
            <h3 className="font-jua text-lg sm:text-xl text-amber-200 flex items-center gap-2">
              <span>🧺 갓 쪄낸 송편 찜기</span>
              <span className="text-xs font-korean bg-emerald-900/80 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {completedSongpyeons.length}개 완성! (목표: 3개)
              </span>
            </h3>

            {completedSongpyeons.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-700/60 px-2.5 py-1 rounded-xl cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 만들기</span>
              </motion.button>
            )}
          </div>

          {/* Steamer Shelf Content */}
          <div className="min-h-[100px] flex items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-700/80">
            {completedSongpyeons.length === 0 ? (
              <div className="text-center py-4 text-slate-400 font-korean text-xs sm:text-sm">
                <span>아직 빚은 송편이 없어요. 반죽과 속재료를 골라 첫 번째 송편을 만들어보세요! 🥟</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {completedSongpyeons.map((songpyeon, idx) => (
                  <motion.div
                    key={songpyeon.id}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="flex flex-col items-center bg-slate-800/90 border border-slate-600 px-4 py-3 rounded-2xl shadow-md min-w-[110px]"
                  >
                    {/* Visual Half-Moon Songpyeon Icon */}
                    <div
                      className={`w-14 h-8 rounded-t-full border-2 shadow flex items-center justify-center relative mb-1.5 ${
                        songpyeon.dough.id === 'white'
                          ? 'bg-white border-slate-300'
                          : songpyeon.dough.id === 'mugwort'
                          ? 'bg-emerald-600 border-emerald-800'
                          : 'bg-pink-400 border-pink-500'
                      }`}
                    >
                      <span className="text-xs">🌿</span>
                    </div>

                    <span className="font-jua text-sm text-slate-200">
                      {idx + 1}호 {songpyeon.dough.colorName} 송편
                    </span>
                    <span className="text-[11px] text-amber-300 font-korean flex items-center gap-1">
                      <span>{songpyeon.filling.emoji}</span>
                      <span>{songpyeon.filling.name}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* "풍성한 한가위!" Celebratory Modal when 3 are finished */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gradient-to-b from-slate-900 to-emerald-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Decorative top ribbon */}
              <div className="text-5xl mb-2 animate-bounce">🌕</div>

              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-bold font-jua mb-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>송편 빚기 미션 대성공!</span>
              </div>

              <h2 className="font-jua text-3xl sm:text-4xl text-amber-200 tracking-wide mb-2">
                풍성한 한가위!
              </h2>

              <p className="text-sm text-slate-200 font-korean leading-relaxed mb-6">
                와아! 알록달록 고운 송편 3개를 모두 정성스레 빚었어요!<br />
                옛날부터 <strong className="text-amber-300">&ldquo;송편을 예쁘게 빚으면 고운 아이를 얻는다&rdquo;</strong>는 이야기가 전해진답니다.
              </p>

              {/* Badges preview */}
              <div className="bg-slate-800/80 rounded-2xl p-3 mb-6 border border-emerald-500/40 flex items-center justify-center gap-3">
                <span className="text-3xl">🥟</span>
                <div className="text-left">
                  <div className="font-jua text-sm text-amber-300">획득 뱃지: 송편 장인</div>
                  <div className="text-xs text-slate-400 font-korean">추석 보름달 도장 수여 완료</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCelebration(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-jua text-sm cursor-pointer"
                >
                  더 만들어보기
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('tap');
                    onNavigateHome();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-jua text-base shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>메인으로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
