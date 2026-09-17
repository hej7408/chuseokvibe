/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, MessageCircleHeart, Loader2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface RabbitChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RabbitChatModal: React.FC<RabbitChatModalProps> = ({ isOpen, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: 'user' | 'rabbit'; text: string }>
  >([
    {
      sender: 'rabbit',
      text: '안녕! 나는 보름달에서 떡방아를 찧는 달토끼야 🌕 추석에 대해 궁금한 점이나 빌고 싶은 소원이 있니?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    '송편은 왜 반달 모양으로 빚을까?',
    '추석에는 왜 보름달을 보며 소원을 빌어?',
    '강강술래는 어떤 전통 놀이야?',
    '우리 가족 모두 건강하게 해주세요!',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    playSound('tap');
    setInputMessage('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      // Secure call to server-side API - NO API key in client!
      const res = await fetch('/api/rabbit-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      playSound('sparkle');

      if (data.reply) {
        setChatHistory((prev) => [...prev, { sender: 'rabbit', text: data.reply }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'rabbit',
            text: '풍성한 가을바람과 함께 네 소원이 꼭 이루어질 거야! 한가위 복 많이 받으렴 🌾',
          },
        ]);
      }
    } catch {
      playSound('sparkle');
      // Fallback smart response for static environments like GitHub Pages
      let fallbackText = '풍성한 가을바람과 함께 네 소원이 꼭 이루어질 거야! 한가위 복 많이 받으렴 🌾';
      if (textToSend.includes('반달') || textToSend.includes('모양') || textToSend.includes('송편')) {
        fallbackText = '반달은 앞으로 점점 더 커져서 보름달이 되듯이, 우리 친구의 꿈과 지혜도 무럭무럭 자라나라는 의미가 담겨 있단다! 🥟';
      } else if (textToSend.includes('보름달') || textToSend.includes('소원')) {
        fallbackText = '추석의 밝고 둥근 보름달은 풍요와 완성을 상징해! 달님께 온 가족의 건강과 행복을 빌면 소원이 쏙 이루어진단다 🌕';
      } else if (textToSend.includes('강강술래')) {
        fallbackText = '강강술래는 보름달 아래에서 이웃들이 다 함께 손을 잡고 노래하며 둥글게 도는 신나는 유네스코 전통 놀이란다! 💃';
      } else if (textToSend.includes('건강') || textToSend.includes('가족') || textToSend.includes('행복')) {
        fallbackText = '정말 따뜻하고 착한 소원이구나! 올 한가위에는 온 가족이 아프지 않고 늘 웃음꽃만 활짝 피어나길 달토끼가 응원할게! ✨';
      }
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'rabbit',
          text: fallbackText,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-amber-300/60 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-xl">
                  🌕
                </div>
                <div>
                  <h3 className="font-jua text-xl text-amber-200 flex items-center gap-1.5">
                    달토끼에게 물어보기
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  </h3>
                  <p className="text-xs text-slate-300 font-korean">
                    추석 이야기와 소원을 달토끼와 안전하게 나눠요
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('tap');
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Questions Recommendation */}
            <div className="mb-3">
              <span className="text-xs font-semibold text-amber-200/80 mb-1.5 block font-korean">
                추천 질문 & 소원 콕 찍어보기:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSend(q)}
                    className="text-xs font-korean bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/60 text-amber-100 px-2.5 py-1 rounded-full transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 my-1 max-h-64 sm:max-h-72">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-korean leading-relaxed shadow-md ${
                      chat.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-indigo-900/80 text-amber-50 border border-indigo-700/50 rounded-tl-none'
                    }`}
                  >
                    {chat.sender === 'rabbit' && (
                      <span className="text-xs font-bold text-amber-300 block mb-1 font-jua">
                        🐰 보름달 토끼
                      </span>
                    )}
                    {chat.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-indigo-900/80 border border-indigo-700/50 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm font-korean text-amber-200 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>달토끼가 귀를 쫑긋거리며 생각하고 있어요...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="mt-3 pt-3 border-t border-indigo-800/60 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="추석 궁금증이나 소원을 적어보세요..."
                disabled={isLoading}
                className="flex-1 bg-slate-900/90 border border-indigo-700/80 rounded-2xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 font-korean"
                maxLength={100}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-jua px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all shrink-0"
              >
                <span>보내기</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
