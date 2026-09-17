export type ScreenType = 'home' | 'songpyeon' | 'charye' | 'quiz';

export interface DoughType {
  id: 'white' | 'mugwort' | 'pink';
  name: string;
  colorName: string;
  bgColor: string;
  borderClass: string;
  badgeBg: string;
  description: string;
  flavor: string;
  placeholderImg: string;
  altDescription: string;
}

export interface FillingType {
  id: 'sesame' | 'chestnut' | 'bean';
  name: string;
  emoji: string;
  bgColor: string;
  badgeBg: string;
  description: string;
  taste: string;
  placeholderImg: string;
  altDescription: string;
}

export interface MadeSongpyeon {
  id: string;
  dough: DoughType;
  filling: FillingType;
  madeAt: Date;
}

export interface CharyeItem {
  id: string;
  name: string;
  category: 'red' | 'white'; // 홍(Red) or 백(White)
  categoryKorean: string;
  correctSide: 'west' | 'east'; // 서쪽(백) or 동쪽(홍)
  colorName: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  description: string;
  reason: string;
  placeholderImg: string;
  altDescription: string;
}

export interface CharyeSlot {
  id: string;
  side: 'west' | 'east';
  sideNameKorean: string;
  sideHanja: string;
  allowedCategory: 'white' | 'red';
  title: string;
  subTitle: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  badge: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface GameProgress {
  songpyeonCompleted: boolean;
  charyeCompleted: boolean;
  quizCompleted: boolean;
  songpyeonCount: number;
  quizScore: number;
}
