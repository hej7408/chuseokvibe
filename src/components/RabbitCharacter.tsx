import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface RabbitCharacterProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'cheering';
  size?: 'sm' | 'md' | 'lg';
  showPestle?: boolean;
  interactive?: boolean;
  onRabbitClick?: () => void;
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({
  message = '안녕! 나는 보름달에서 온 달토끼야!',
  mood = 'happy',
  size = 'md',
  showPestle = true,
  interactive = true,
  onRabbitClick,
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32 sm:w-36 sm:h-36',
    lg: 'w-40 h-40 sm:w-48 sm:h-48',
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative mb-3 max-w-xs sm:max-w-md bg-white/95 text-slate-800 px-4 py-2.5 rounded-3xl shadow-xl border-2 border-amber-300 backdrop-blur-sm z-10"
        >
          <div className="flex items-center gap-1.5 font-jua text-sm sm:text-base leading-relaxed text-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 inline-block animate-spin" />
            <span>{message}</span>
          </div>
          {/* Bubble Tail */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-amber-300 rotate-45" />
        </motion.div>
      )}

      {/* Rabbit Body Container */}
      <motion.div
        whileHover={interactive ? { scale: 1.06, rotate: [-1, 1, -1] } : undefined}
        whileTap={interactive ? { scale: 0.92 } : undefined}
        onClick={onRabbitClick}
        className={`relative ${sizeClasses[size]} cursor-pointer`}
      >
        {/* SVG Decorative Custom Rabbit Character */}
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Placehold image with detailed alt description as requested by user prompt */}
          <img
            src="https://placehold.co/180x180/fff7ed/ea580c?text=%EB%8B%AC%ED%86%A0%EB%81%BC"
            alt="보름달에서 한복 조끼를 입고 떡방아 절구를 찧는 귀여운 흰색 아기 달토끼 일러스트레이션"
            className="w-full h-full object-contain rounded-full shadow-inner border-2 border-amber-300/40 bg-gradient-to-b from-amber-50 to-orange-100 p-1"
          />

          {/* Interactive Badge / Mood Overlay */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="absolute -top-2 -right-1 bg-amber-400 text-slate-900 border border-amber-200 text-xs font-bold font-jua px-2 py-0.5 rounded-full shadow-md flex items-center gap-1"
          >
            {mood === 'celebrating' && <span>🎉 만세!</span>}
            {mood === 'happy' && <span>🍡 냠냠</span>}
            {mood === 'cheering' && <span>💪 파이팅</span>}
            {mood === 'thinking' && <span>💡 고민중</span>}
          </motion.div>

          {/* Pestle Icon if enabled */}
          {showPestle && (
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -bottom-1 -left-2 text-2xl"
              title="떡방아 절구"
            >
              🪵
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
