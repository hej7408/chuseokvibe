import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Award, Compass } from 'lucide-react';
import { CharyeItem } from '../types';
import { playSound } from '../utils/audio';
import { RabbitCharacter } from './RabbitCharacter';

interface CharyePuzzleGameProps {
  onComplete: () => void;
  onNavigateHome: () => void;
}

const PUZZLE_ITEMS: CharyeItem[] = [
  {
    id: 'apple',
    name: '사과 (붉은색 과일)',
    category: 'red',
    categoryKorean: '홍(紅) - 붉은 과일',
    correctSide: 'east', // 동쪽 (오른쪽)
    colorName: '붉은색',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-400',
    emoji: '🍎',
    description: '가을 햇살을 머금고 붉게 익은 탐스러운 꿀사과',
    reason: '사과는 붉은 과일(홍)이므로 동쪽(오른쪽) 자리에 놓아야 해요!',
    placeholderImg: 'https://placehold.co/120x120/ffe4e6/e11d48?text=%EC%82%AC%EA%B3%BC',
    altDescription: '차례상에 정성스레 쌓아 올릴 붉고 둥근 가을 햇사과 일러스트레이션',
  },
  {
    id: 'pear',
    name: '배 (흰 과일)',
    category: 'white',
    categoryKorean: '백(白) - 흰 과일',
    correctSide: 'west', // 서쪽 (왼쪽)
    colorName: '흰색/연노랑',
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    emoji: '🍐',
    description: '껍질 속 과육이 눈처럼 뽀얗고 시원 달콤한 가을 배',
    reason: '배는 속살이 흰 과일(백)이므로 서쪽(왼쪽) 자리에 놓아야 해요!',
    placeholderImg: 'https://placehold.co/120x120/fefce8/ca8a04?text=%EB%B0%B0',
    altDescription: '껍질을 벗기면 흰 속살이 드러나는 달콤하고 시원한 가을 배 일러스트레이션',
  },
  {
    id: 'jujube',
    name: '대추 (붉은 열매)',
    category: 'red',
    categoryKorean: '홍(紅) - 붉은 열매',
    correctSide: 'east', // 동쪽 (오른쪽)
    colorName: '붉은 갈색',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    emoji: '🪵',
    description: '씨가 하나여서 왕이나 높은 벼슬을 상징하는 붉은 대추',
    reason: '붉은 빛깔의 대추는 붉은 과일 열인 동쪽(오른쪽)에 놓아요!',
    placeholderImg: 'https://placehold.co/120x120/fef2f2/991b1b?text=%EB%8C%80%EC%B6%94',
    altDescription: '자손의 번창을 기원하는 주름진 붉은 가을 대추 일러스트레이션',
  },
  {
    id: 'persimmon',
    name: '감 (주홍색 과일)',
    category: 'red',
    categoryKorean: '홍(紅) - 붉은 과일',
    correctSide: 'east', // 동쪽 (오른쪽)
    colorName: '주홍색',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    emoji: '🍊',
    description: '가을 단풍처럼 곱게 물든 달콤한 주홍빛 단감',
    reason: '붉고 주황빛을 띠는 감도 동쪽(오른쪽) 자리에 함께 놓는답니다!',
    placeholderImg: 'https://placehold.co/120x120/fff7ed/c2410c?text=%EA%B0%90',
    altDescription: '나뭇가지에 매달린 주홍빛으로 잘 익은 가을 단감 일러스트레이션',
  },
];

export const CharyePuzzleGame: React.FC<CharyePuzzleGameProps> = ({
  onComplete,
  onNavigateHome,
}) => {
  // Slots on the table: West (Left) and East (Right)
  const [placedWest, setPlacedWest] = useState<CharyeItem[]>([]);
  const [placedEast, setPlacedEast] = useState<CharyeItem[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<CharyeItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>(
    '사과와 배를 알맞은 차례상 자리에 올려봐요! "홍동백서"를 기억하세요!'
  );
  const [bounceFruitId, setBounceFruitId] = useState<string | null>(null);
  const [rabbitMood, setRabbitMood] = useState<'happy' | 'thinking' | 'cheering' | 'celebrating'>('happy');
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  // Remaining fruits in tray
  const placedIds = [...placedWest, ...placedEast].map((f) => f.id);
  const remainingFruits = PUZZLE_ITEMS.filter((f) => !placedIds.includes(f.id));

  // Handle placing a fruit on a side
  const handlePlaceFruit = (side: 'west' | 'east') => {
    if (!selectedFruit) {
      playSound('tap');
      setFeedbackMessage('먼저 아래 바구니에서 과일을 골라주세요!');
      return;
    }

    // Check if the fruit belongs to this side based on 홍동백서 rule
    if (selectedFruit.correctSide === side) {
      // CORRECT PLACEMENT!
      playSound('sparkle');
      if (side === 'west') {
        setPlacedWest((prev) => [...prev, selectedFruit]);
      } else {
        setPlacedEast((prev) => [...prev, selectedFruit]);
      }

      setFeedbackMessage(
        `딩동댕! 정답이에요! ${selectedFruit.name}의 자리를 바르게 찾았어요! 👏`
      );
      setRabbitMood('celebrating');

      const nextPlacedCount = placedIds.length + 1;
      setSelectedFruit(null);

      // Check if primary educational fruits (사과 & 배) or all fruits are placed
      const applePlaced = selectedFruit.id === 'apple' || placedIds.includes('apple');
      const pearPlaced = selectedFruit.id === 'pear' || placedIds.includes('pear');

      if (nextPlacedCount >= 2 && applePlaced && pearPlaced) {
        // Solved the key core puzzle!
        setTimeout(() => {
          playSound('complete');
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
          });
          setIsGameCompleted(true);
          onComplete();
        }, 600);
      }
    } else {
      // INCORRECT PLACEMENT -> Smooth bounce rejection!
      playSound('bounce');
      setBounceFruitId(selectedFruit.id);
      setRabbitMood('thinking');

      const hintSide = selectedFruit.correctSide === 'east' ? '동쪽(오른쪽)' : '서쪽(왼쪽)';
      setFeedbackMessage(
        `어라? ${selectedFruit.name}은(는) ${selectedFruit.categoryKorean}이라서 ${hintSide} 자리에 놓아야 해요!`
      );

      setTimeout(() => {
        setBounceFruitId(null);
      }, 600);
    }
  };

  const handleReset = () => {
    playSound('tap');
    setPlacedWest([]);
    setPlacedEast([]);
    setSelectedFruit(null);
    setIsGameCompleted(false);
    setFeedbackMessage('사과와 배를 알맞은 차례상 자리에 올려봐요! "홍동백서"를 기억하세요!');
    setRabbitMood('happy');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-slate-900 via-rose-950 to-slate-950 px-4 py-6 text-slate-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header Guide */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-400/30 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>미니게임 2: 차례상 퍼즐 (예절 교육)</span>
          </div>

          <h1 className="font-jua text-2xl sm:text-4xl text-rose-100 drop-shadow">
            &lsquo;홍동백서&rsquo; 규칙으로 <span className="text-amber-300">과일 자리</span>를 찾아요!
          </h1>

          {/* Educational Rule Explain Banner */}
          <div className="mt-3 max-w-2xl mx-auto bg-slate-800/90 border border-amber-400/40 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-200 font-korean flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left leading-relaxed">
                <strong className="text-amber-300 font-jua text-sm sm:text-base mr-1">
                  홍동백서(紅東白西)의 뜻:
                </strong>
                붉을 <strong>홍(紅)</strong>, 동녘 <strong>동(東)</strong>, 흰 <strong>백(白)</strong>, 서녘 <strong>서(西)</strong>!
                <div className="text-slate-300 text-xs mt-0.5">
                  &bull; <span className="text-rose-300 font-bold">붉은 과일(사과 등)</span>은 <strong>동쪽(오른쪽)</strong>에 놓아요.<br />
                  &bull; <span className="text-amber-200 font-bold">흰 과일(배 등)</span>은 <strong>서쪽(왼쪽)</strong>에 놓아요.
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">기준:</span>
              <span className="text-xs font-bold text-amber-300">차례상을 바라볼 때</span>
            </div>
          </div>
        </div>

        {/* Rabbit Guide Speech & Status */}
        <div className="mb-6 flex justify-center">
          <RabbitCharacter
            message={feedbackMessage}
            mood={rabbitMood}
            size="sm"
            showPestle={false}
          />
        </div>

        {/* Traditional Charye Table (차례상 인터랙티브 퍼즐 판) */}
        <div className="relative bg-gradient-to-b from-amber-900 via-stone-900 to-amber-950 rounded-3xl p-5 sm:p-8 border-4 border-amber-600/50 shadow-2xl overflow-hidden mb-6">
          {/* Table Eaves / Traditional Mat Pattern */}
          <div className="absolute top-2 inset-x-4 flex justify-between items-center text-xs text-amber-300/60 font-jua border-b border-amber-600/30 pb-1">
            <span>[신위: 북쪽] 조상님을 모시는 높은 자리</span>
            <span>전통 제례 예절</span>
          </div>

          {/* Table Surface Area */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* WEST SIDE (서쪽 - 왼쪽 / 흰 과일 자리) */}
            <motion.div
              id="slot-west"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlaceFruit('west')}
              className={`rounded-2xl p-4 sm:p-6 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-between min-h-[200px] sm:min-h-[220px] relative ${
                selectedFruit && selectedFruit.correctSide === 'west'
                  ? 'bg-amber-100/15 border-amber-400 ring-2 ring-amber-400/50'
                  : 'bg-black/30 border-amber-400/40 hover:bg-black/40'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="bg-amber-200 text-slate-950 font-jua text-sm sm:text-base px-3 py-1 rounded-full font-bold shadow-md">
                  서쪽 (西) &bull; 왼쪽
                </span>
                <span className="text-xs font-bold text-amber-200 bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  흰 과일 자리 (백 &bull; 白)
                </span>
              </div>

              {/* Placed Fruit Display on Wooden/Brass Plate */}
              <div className="my-auto flex flex-wrap items-center justify-center gap-3">
                {placedWest.length === 0 ? (
                  <div className="flex flex-col items-center text-slate-400 text-center py-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-200/40 flex items-center justify-center text-3xl bg-amber-950/30 mb-2">
                      🍐
                    </div>
                    <span className="text-xs font-jua text-amber-200/80">
                      흰 속살의 과일(배)을 이곳에 올려주세요!
                    </span>
                  </div>
                ) : (
                  placedWest.map((fruit) => (
                    <motion.div
                      key={fruit.id}
                      initial={{ scale: 0, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="flex flex-col items-center bg-slate-900/90 border-2 border-amber-400/80 p-3 rounded-2xl shadow-xl min-w-[100px]"
                    >
                      <span className="text-3xl mb-1">{fruit.emoji}</span>
                      <span className="font-jua text-sm text-amber-100">{fruit.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> 바른 위치!
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="text-[11px] text-amber-300/80 font-korean">
                과일 선택 후 이곳을 클릭하세요
              </div>
            </motion.div>

            {/* EAST SIDE (동쪽 - 오른쪽 / 붉은 과일 자리) */}
            <motion.div
              id="slot-east"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlaceFruit('east')}
              className={`rounded-2xl p-4 sm:p-6 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-between min-h-[200px] sm:min-h-[220px] relative ${
                selectedFruit && selectedFruit.correctSide === 'east'
                  ? 'bg-rose-500/15 border-rose-400 ring-2 ring-rose-400/50'
                  : 'bg-black/30 border-rose-400/40 hover:bg-black/40'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="bg-rose-500 text-white font-jua text-sm sm:text-base px-3 py-1 rounded-full font-bold shadow-md">
                  동쪽 (東) &bull; 오른쪽
                </span>
                <span className="text-xs font-bold text-rose-200 bg-black/40 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                  붉은 과일 자리 (홍 &bull; 紅)
                </span>
              </div>

              {/* Placed Fruit Display on Wooden/Brass Plate */}
              <div className="my-auto flex flex-wrap items-center justify-center gap-3">
                {placedEast.length === 0 ? (
                  <div className="flex flex-col items-center text-slate-400 text-center py-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-rose-400/40 flex items-center justify-center text-3xl bg-rose-950/30 mb-2">
                      🍎
                    </div>
                    <span className="text-xs font-jua text-rose-200/80">
                      붉은 과일(사과, 대추 등)을 이곳에 올려주세요!
                    </span>
                  </div>
                ) : (
                  placedEast.map((fruit) => (
                    <motion.div
                      key={fruit.id}
                      initial={{ scale: 0, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="flex flex-col items-center bg-slate-900/90 border-2 border-rose-400/80 p-3 rounded-2xl shadow-xl min-w-[100px]"
                    >
                      <span className="text-3xl mb-1">{fruit.emoji}</span>
                      <span className="font-jua text-sm text-rose-100">{fruit.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> 바른 위치!
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="text-[11px] text-rose-300/80 font-korean">
                과일 선택 후 이곳을 클릭하세요
              </div>
            </motion.div>
          </div>

          {/* Table Front Trim */}
          <div className="mt-4 pt-3 border-t border-amber-600/30 flex items-center justify-between text-xs text-amber-200/70 font-korean">
            <span>※ 차례상에 올리는 과일은 꼭대기 부분을 편평하게 깎아서 정갈하게 차려요.</span>
            {(placedWest.length > 0 || placedEast.length > 0) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-black/40 px-2.5 py-1 rounded-xl cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> 다시 놓기
              </button>
            )}
          </div>
        </div>

        {/* Tray of Available Fruits (과일 바구니) */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 border-2 border-rose-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
            <h3 className="font-jua text-lg text-rose-200 flex items-center gap-2">
              <span>🧺 차례상에 올릴 제철 과일 바구니</span>
              <span className="text-xs text-slate-400 font-korean">
                남은 과일: {remainingFruits.length}개
              </span>
            </h3>
            {selectedFruit && (
              <span className="text-xs font-jua bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full animate-pulse">
                {selectedFruit.name} 선택됨! 상의 자리를 눌러주세요
              </span>
            )}
          </div>

          {remainingFruits.length === 0 ? (
            <div className="text-center py-4 font-jua text-base text-amber-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>모든 과일을 차례상에 알맞게 잘 올렸어요! 훌륭해요!</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {remainingFruits.map((fruit) => {
                const isSelected = selectedFruit?.id === fruit.id;
                const isBouncing = bounceFruitId === fruit.id;

                return (
                  <motion.div
                    key={fruit.id}
                    id={`fruit-${fruit.id}`}
                    animate={
                      isBouncing
                        ? {
                            x: [-14, 14, -10, 10, -5, 5, 0],
                            rotate: [-4, 4, -3, 3, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      playSound('tap');
                      setSelectedFruit(fruit);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-amber-400 bg-slate-700 shadow-xl ring-2 ring-amber-400/60 scale-105'
                        : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700/60'
                    }`}
                  >
                    {/* Placeholder image with alt description as requested */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mb-2 border border-slate-600 relative">
                      <img
                        src={fruit.placeholderImg}
                        alt={fruit.altDescription}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0.5 right-1 text-base">
                        {fruit.emoji}
                      </div>
                    </div>

                    <h4 className="font-jua text-sm sm:text-base text-slate-100">
                      {fruit.name}
                    </h4>

                    <span className="text-[11px] font-korean font-semibold text-slate-300 mt-0.5">
                      {fruit.categoryKorean}
                    </span>

                    <p className="text-[10px] text-slate-400 font-korean mt-1 line-clamp-1">
                      {fruit.description}
                    </p>

                    <button
                      className={`mt-2 w-full py-1.5 rounded-xl text-xs font-jua transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {isSelected ? '선택됨' : '선택하기'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isGameCompleted && (
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
              className="bg-gradient-to-b from-slate-900 to-rose-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="text-5xl mb-2 animate-bounce">🍎</div>

              <div className="inline-flex items-center gap-1.5 bg-rose-400/20 text-rose-300 border border-rose-300/40 px-3 py-1 rounded-full text-xs font-bold font-jua mb-2">
                <Award className="w-4 h-4 text-rose-300" />
                <span>홍동백서 퍼즐 정복 완료!</span>
              </div>

              <h2 className="font-jua text-3xl sm:text-4xl text-amber-200 tracking-wide mb-2">
                예절 지킴이 탄생!
              </h2>

              <p className="text-sm text-slate-200 font-korean leading-relaxed mb-6">
                참 잘했어요! 붉은 과일(홍)인 <strong className="text-rose-300">사과</strong>는 동쪽에,<br />
                흰 과일(백)인 <strong className="text-amber-200">배</strong>는 서쪽에 올바르게 놓았어요!<br />
                이제 추석 차례상 차리기 예절은 친구가 일등이에요!
              </p>

              {/* Badge Earned Card */}
              <div className="bg-slate-800/80 rounded-2xl p-3.5 mb-6 border border-rose-500/40 flex items-center justify-center gap-3">
                <span className="text-3xl">🎖️</span>
                <div className="text-left">
                  <div className="font-jua text-sm text-amber-300">획득 뱃지: 예절 지킴이</div>
                  <div className="text-xs text-slate-400 font-korean">홍동백서 전통 예절 상식 마스터</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsGameCompleted(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-jua text-sm cursor-pointer"
                >
                  차례상 더 보기
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
