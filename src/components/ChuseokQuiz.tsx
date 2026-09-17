import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { QuizQuestion } from '../types';
import { playSound } from '../utils/audio';
import { RabbitCharacter } from './RabbitCharacter';

interface ChuseokQuizProps {
  onComplete: (score: number) => void;
  onNavigateHome: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '추석의 또 다른 이름(순우리말이나 한자어)은 무엇일까요?',
    badge: '추석의 명칭',
    options: ['가배 (한가위)', '설날', '단오'],
    correctIndex: 0,
    hint: '신라 유리왕 때 길쌈 놀이를 하며 "가배"라고 불렀고, 순우리말로는 "한가위"라고 해요!',
    explanation:
      '정답이에요! 추석은 신라 시대부터 "가배(嘉俳)"라고 불렀으며, "크다"는 뜻의 "한"과 "가운데"라는 뜻의 "가위"가 합쳐진 "한가위"라고도 부른답니다.',
  },
  {
    id: 2,
    question: '추석날 밤 밝은 보름달 아래에서 여인들이 손을 맞잡고 원을 그리며 도는 전통 민속놀이는?',
    badge: '전통 민속놀이',
    options: ['쥐불놀이', '강강술래', '연날리기'],
    correctIndex: 1,
    hint: '동그란 보름달처럼 둥글게 원을 만들어 손을 잡고 노래 부르며 돌아요!',
    explanation:
      '정답이에요! 유네스코 인류무형문화유산으로 지정된 강강술래는 밝은 보름달 아래서 풍년을 기원하고 이웃과 화합을 다지는 아름다운 전통 놀이예요.',
  },
  {
    id: 3,
    question: '송편을 찔 때 솥 바닥에 깔아 떡이 서로 붙지 않게 하고 상쾌한 숲 향을 입히는 재료는?',
    badge: '송편의 유래',
    options: ['솔잎 (소나무 잎)', '단풍잎', '배춧잎'],
    correctIndex: 0,
    hint: '소나무에서 딴 바늘 모양의 푸른 잎이에요!',
    explanation:
      '정답이에요! 소나무의 "솔잎"을 깔고 쪄서 소나무 송(松) 자를 써서 "송편(松餠)"이라고 부른답니다. 솔잎 피톤치드가 떡을 신선하게 보관해 주기도 해요!',
  },
];

export const ChuseokQuiz: React.FC<ChuseokQuizProps> = ({
  onComplete,
  onNavigateHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [rabbitSpeech, setRabbitSpeech] = useState(
    '추석 상식 퀴즈에 도전해봐! 문제를 꼼꼼히 읽고 정답을 골라줘!'
  );
  const [rabbitMood, setRabbitMood] = useState<'happy' | 'thinking' | 'celebrating' | 'cheering'>('happy');

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    playSound('tap');
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    const correct = selectedOption === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playSound('sparkle');
      // Firework celebration
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#F59E0B', '#F43F5E', '#10B981'],
      });
      setScore((prev) => prev + 1);
      setRabbitMood('celebrating');
      setRabbitSpeech('우와, 멋져요! 정답을 완벽하게 맞췄어요! 🎉');
    } else {
      playSound('bounce');
      setRabbitMood('thinking');
      setRabbitSpeech(`아쉬워요! 다시 생각해볼까요? 힌트: ${currentQ.hint}`);
    }
  };

  const handleNextQuestion = () => {
    playSound('tap');
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setRabbitMood('happy');
      setRabbitSpeech('다음 문제도 힘차게 풀어보자! 파이팅!');
    } else {
      // Quiz finished
      playSound('fanfare');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
      setIsQuizFinished(true);
      onComplete(score + (isCorrect ? 1 : 0));
    }
  };

  const handleRetryQuestion = () => {
    playSound('tap');
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setRabbitMood('cheering');
    setRabbitSpeech('괜찮아! 다시 한 번 천천히 골라보자!');
  };

  const handleRestartQuiz = () => {
    playSound('tap');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setScore(0);
    setIsQuizFinished(false);
    setRabbitMood('happy');
    setRabbitSpeech('추석 상식 퀴즈에 도전해봐! 문제를 꼼꼼히 읽고 정답을 골라줘!');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950 px-4 py-6 text-slate-100 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>학습 콘텐츠: 추석 상식 퀴즈</span>
          </div>

          <h1 className="font-jua text-2xl sm:text-4xl text-sky-100 drop-shadow">
            보름달 토끼와 함께하는 <span className="text-amber-300">추석 퀴즈</span>
          </h1>

          {/* Progress dots */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {QUIZ_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-jua border transition-all ${
                  currentIndex === idx
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold scale-105'
                    : idx < currentIndex
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span>Q{idx + 1}</span>
                {idx < currentIndex && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            ))}
          </div>
        </div>

        {/* Rabbit Helper */}
        <div className="mb-5 flex justify-center">
          <RabbitCharacter
            message={rabbitSpeech}
            mood={rabbitMood}
            size="sm"
            showPestle={false}
          />
        </div>

        {/* Quiz Card */}
        {!isQuizFinished ? (
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-2 border-sky-500/40 shadow-2xl"
          >
            {/* Question Top Badge */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
              <span className="font-jua text-xs sm:text-sm bg-sky-900/80 text-sky-200 border border-sky-400/30 px-3 py-1 rounded-full">
                문제 {currentIndex + 1} / {QUIZ_QUESTIONS.length} &bull; {currentQ.badge}
              </span>
              <span className="text-xs text-amber-300 font-jua">
                현재 점수: {score}점
              </span>
            </div>

            {/* Question Text */}
            <h2 className="font-jua text-lg sm:text-2xl text-slate-100 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            {/* Option Cards (Big, tactile buttons for kids) */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isOptionCorrect = idx === currentQ.correctIndex;

                let optionStyle = 'bg-slate-700/70 border-slate-600 hover:bg-slate-700 text-slate-100';

                if (isSubmitted) {
                  if (isOptionCorrect) {
                    optionStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-300 shadow-lg';
                  } else if (isSelected && !isOptionCorrect) {
                    optionStyle = 'bg-rose-800/80 border-rose-500 text-rose-100';
                  } else {
                    optionStyle = 'bg-slate-800/50 border-slate-700 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-sky-600 border-sky-300 text-white font-bold ring-2 ring-sky-300 shadow-md scale-[1.01]';
                }

                return (
                  <motion.button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    whileHover={!isSubmitted ? { scale: 1.02 } : undefined}
                    whileTap={!isSubmitted ? { scale: 0.98 } : undefined}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-base sm:text-lg font-jua ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-sm font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSubmitted && isOptionCorrect && (
                      <span className="text-sm bg-white/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 정답!
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Answer Explanation & Feedback Display */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl border mb-6 text-sm font-korean leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="font-jua text-base mb-1 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-400">🎉 정답입니다! 축하해요!</span>
                    ) : (
                      <span className="text-rose-400">💡 아쉬워요! 배움 카드:</span>
                    )}
                  </div>
                  <p>{currentQ.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isSubmitted ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-3 rounded-2xl font-jua text-base sm:text-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all ${
                    selectedOption !== null
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>정답 확인하기</span>
                  <CheckCircle2 className="w-5 h-5" />
                </motion.button>
              ) : isCorrect ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-jua text-base sm:text-lg shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentIndex < QUIZ_QUESTIONS.length - 1
                      ? '다음 문제로!'
                      : '결과 확인하기'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetryQuestion}
                  className="px-6 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-jua text-base shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 풀기</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Quiz Completion View */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl text-center"
          >
            <div className="text-6xl mb-3 animate-bounce">🎓</div>

            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-300/40 px-4 py-1 rounded-full text-xs font-bold font-jua mb-3">
              <Award className="w-4 h-4 text-amber-300" />
              <span>추석 퀴즈 완료!</span>
            </div>

            <h2 className="font-jua text-3xl sm:text-4xl text-amber-200 mb-2">
              축하합니다! 추석 척척박사!
            </h2>

            <p className="text-sm sm:text-base text-slate-200 font-korean leading-relaxed mb-6">
              추석의 유래와 가배, 강강술래, 솔잎의 지혜까지 모두 완벽하게 배웠어요!<br />
              친구는 이제 우리 전통 명절 추석의 진정한 박사님이에요!
            </p>

            {/* Award certificate badge preview */}
            <div className="bg-slate-900/80 rounded-2xl p-4 mb-8 border border-sky-400/40 flex items-center justify-center gap-4 max-w-sm mx-auto">
              <span className="text-4xl">🏮</span>
              <div className="text-left">
                <div className="font-jua text-base text-amber-300">획득 뱃지: 추석 척척박사</div>
                <div className="text-xs text-slate-400 font-korean">초등 추석 상식 3문제 마스터</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestartQuiz}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-jua text-sm cursor-pointer"
              >
                퀴즈 다시 풀기
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
        )}
      </div>
    </div>
  );
};
