/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load local environment variables if available
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json());

// Lazy-initialize Gemini AI client server-side
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. AI Studio의 Settings > Secrets 패널에서 API 키를 등록해주세요.'
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Server-side AI endpoint: 달토끼와의 안전한 대화 & 추석 소원 빌기
app.post('/api/rabbit-chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해주세요.' });
      return;
    }

    // Check API key configuration gracefully
    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply:
          '반가워 친구야! 보름달 토끼와 실시간으로 이야기하려면 Google AI Studio의 Settings > Secrets에서 GEMINI_API_KEY를 설정해주면 돼! 올 추석에도 건강하고 행복하길 바라!',
        configured: false,
      });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `너는 한국 전통 명절 추석의 달나라에서 온 친절하고 깜찍한 '보름달 토끼'야. 
초등학생 아이들의 질문이나 추석 소원에 따뜻하고 다정하게 존댓말로 답해줘. 
추석 풍습(송편, 강강술래, 차례, 달맞이, 보름달, 풍작 감사 등)에 대한 올바른 지혜와 따뜻한 응원을 담아줘.
답변은 초등학생 눈높이에 맞추어 2~3문장 이내로 쉽고 재미있고 다정하게 말해줘. 이모지도 친근하게 1~2개 곁들여줘.

어린이의 이야기: "${message.trim()}"`,
            },
          ],
        },
      ],
    });

    const reply = response.text || '보름달처럼 둥글고 환한 한가위 보내렴! 🌕';
    res.json({ reply, configured: true });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || '달토끼와 연결하는 중 잠시 오류가 발생했어요.',
    });
  }
});

async function startServer() {
  // Redirect root path to /chuseokvibe/ for GitHub Pages preview compatibility
  app.get('/', (_req: Request, res: Response) => {
    res.redirect('/chuseokvibe/');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the compiled static SPA from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/chuseokvibe', express.static(distPath));
    app.use(express.static(distPath));
    app.get('/chuseokvibe/*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
