import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Moon, Heart, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ChuseokStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChuseokStoryModal: React.FC<ChuseokStoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl bg-slate-900 border-4 border-sky-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
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

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-sky-400/20 text-sky-300 border border-sky-300/40 px-3 py-1 rounded-full text-xs font-bold font-jua mb-2">
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>추석 배움터</span>
            </div>
            <h2 className="font-jua text-2xl sm:text-3xl text-sky-200">
              추석(한가위) 이야기와 풍습
            </h2>
          </div>

          {/* Story Sections */}
          <div className="space-y-4 font-korean text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <h3 className="font-jua text-base sm:text-lg text-amber-300 flex items-center gap-2 mb-1.5">
                <Moon className="w-4 h-4 text-amber-400" />
                <span>1. 추석과 한가위의 뜻</span>
              </h3>
              <p>
                추석(秋夕)은 음력 8월 15일로, &lsquo;가을 저녁&rsquo;이라는 뜻이에요.
                순우리말로는 <strong className="text-amber-300">&lsquo;한가위&rsquo;</strong>라고 부르는데,
                &lsquo;한&rsquo;은 크다는 뜻이고 &lsquo;가위&rsquo;는 8월의 한가운데를 뜻한답니다.
                즉, 가을의 한가운데에 있는 가장 풍요롭고 큰 명절이에요!
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <h3 className="font-jua text-base sm:text-lg text-emerald-300 flex items-center gap-2 mb-1.5">
                <span>🥟</span>
                <span>2. 왜 송편은 반달 모양일까요?</span>
              </h3>
              <p>
                보름달 명절인데 왜 송편은 동그란 보름달이 아니라 반달 모양일까요?
                옛 조상님들은 <strong className="text-emerald-300">반달은 앞으로 점점 차올라 보름달이 되듯이</strong>,
                우리 가족과 나라의 미래도 날마다 더 크고 밝게 번창하기를 바라는 지혜로운 소망을 담아
                반달 모양으로 빚었답니다.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <h3 className="font-jua text-base sm:text-lg text-rose-300 flex items-center gap-2 mb-1.5">
                <span>🍎</span>
                <span>3. 홍동백서(紅東白西)의 의미</span>
              </h3>
              <p>
                차례상에 올리는 과일도 정해진 자리가 있어요.
                <strong className="text-rose-300">붉은 과일(홍)인 사과는 동쪽</strong>(오른쪽)에,
                <strong className="text-amber-200">흰 과일(백)인 배는 서쪽</strong>(왼쪽)에 놓는 전통 규칙이 &lsquo;홍동백서&rsquo;예요.
                가을 햇살을 머금은 햅쌀과 갓 딴 햇과일을 정성껏 조상님께 먼저 대접하며 감사하는 마음을 배웠답니다.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <h3 className="font-jua text-base sm:text-lg text-sky-300 flex items-center gap-2 mb-1.5">
                <Heart className="w-4 h-4 text-sky-300" />
                <span>4. 따뜻한 한가위 덕담</span>
              </h3>
              <p>
                &ldquo;더도 말고 덜도 말고 늘 한가위만 같아라&rdquo;라는 옛말처럼,
                곡식과 과일이 가득하고 온 가족과 이웃이 함께 웃음을 나누는 가장 행복한 명절이 바로 추석이랍니다.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="px-8 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-jua text-base shadow-md cursor-pointer"
            >
              잘 알겠어요!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
