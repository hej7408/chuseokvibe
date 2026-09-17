import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2, Star } from 'lucide-react';
import { GameProgress } from '../types';
import { playSound } from '../utils/audio';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  if (!isOpen) return null;

  const badges = [
    {
      id: 'songpyeon',
      title: '송편 장인 뱃지',
      emoji: '🥟',
      colorBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: '흰색, 쑥색, 분홍색 반죽에 정성을 담아 송편 3개를 빚음',
      isUnlocked: progress.songpyeonCompleted,
      requirement: '송편 만들기에서 송편 3개 빚기',
    },
    {
      id: 'charye',
      title: '예절 지킴이 뱃지',
      emoji: '🍎',
      colorBg: 'bg-rose-100 text-rose-900 border-rose-300',
      description: '홍동백서(붉은 과일은 동쪽, 흰 과일은 서쪽) 원칙을 바르게 익힘',
      isUnlocked: progress.charyeCompleted,
      requirement: '차례상 퍼즐에서 홍동백서 맞추기',
    },
    {
      id: 'quiz',
      title: '추석 척척박사 뱃지',
      emoji: '🏮',
      colorBg: 'bg-sky-100 text-sky-900 border-sky-300',
      description: '가배의 유래와 강강술래, 솔잎의 지혜를 모두 맞춤',
      isUnlocked: progress.quizCompleted,
      requirement: '추석 상식 퀴즈 3문제 완료하기',
    },
  ];

  const completedCount = badges.filter((b) => b.isUnlocked).length;
  const isAllCompleted = completedCount === 3;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playSound('tap');
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-bold font-jua mb-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>추석 모험 도장판</span>
            </div>
            <h2 className="font-jua text-2xl sm:text-3xl text-amber-200">
              내 추석 탐험 뱃지 ({completedCount}/3)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-korean mt-1">
              3가지 활동을 모두 완료하면 &lsquo;한가위 대장 상장&rsquo;을 받을 수 있어요!
            </p>
          </div>

          {/* Badges List */}
          <div className="space-y-3 mb-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                  badge.isUnlocked
                    ? 'bg-slate-800/90 border-amber-400 shadow-md'
                    : 'bg-slate-850/50 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 shadow-inner ${
                    badge.isUnlocked
                      ? badge.colorBg
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {badge.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-jua text-base sm:text-lg text-slate-100 flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {badge.isUnlocked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </h3>
                    <span
                      className={`text-xs font-jua px-2 py-0.5 rounded-full ${
                        badge.isUnlocked
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {badge.isUnlocked ? '획득 완료!' : '도전 중'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-korean mt-0.5">
                    {badge.isUnlocked ? badge.description : badge.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Completion Certificate Banner */}
          {isAllCompleted ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-4 rounded-2xl text-center font-jua shadow-lg mb-4"
            >
              <div className="flex items-center justify-center gap-1 text-lg font-bold mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span>한가위 대장 상장 수여!</span>
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-xs font-korean font-semibold leading-relaxed">
                축하합니다! 송편 만들기, 홍동백서 차례상, 추석 퀴즈를 모두 훌륭하게 마쳤습니다.
                달토끼와 온 가족의 축복을 보냅니다! 🌕
              </p>
            </motion.div>
          ) : (
            <div className="text-center text-xs text-slate-400 font-korean mb-4">
              아직 획득하지 못한 뱃지에 도전해보세요!
            </div>
          )}

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="w-full sm:w-auto px-8 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-jua text-base shadow-md cursor-pointer"
            >
              확인했어요!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
