import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or when key exists
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Seoul Food Sommelier endpoint
app.post("/api/ai/sommelier", async (req, res) => {
  try {
    const { prompt, district, occasion, budget, cuisinePreference } = req.body;

    if (!prompt && !occasion) {
      return res.status(400).json({ error: "질문이나 상황을 입력해주세요." });
    }

    const ai = getAi();
    
    const systemPrompt = `당신은 대한민국 서울의 모든 골목 맛집, 노포(Heritage), 미슐랭 가이드, 블루리본 서베이, 트렌디한 핫플레이스를 완벽하게 꿰뚫고 있는 '서울 최고 권위의 미식 소믈리에 & 푸드 컨시어지'입니다.
서울의 각 지역구(종로/을지로, 성수/건대, 강남/신사/청담, 용산/삼각지/한남, 홍대/연남/망원, 마포/공덕, 잠실/송리단길, 여의도/문래 등)의 특색과 분위기, 웨이팅 팁, 대표 시그니처 메뉴, 주류 페어링을 전문적이고 친절하며 미식가의 위트가 담긴 어조로 추천합니다.

[응답 가이드라인]
1. 사용자의 요청(지역, 상황, 예산, 취향)에 딱 맞는 실제 서울의 검증된 맛집 2~3곳을 구체적으로 추천하세요.
2. 각 식당별로:
   - 정확한 식당 이름 (한글 & 영문)
   - 위치 (지하철역 및 출구, 행정구역)
   - 시그니처 추천 메뉴 및 대략적인 가격대
   - 미식 포인트 (왜 여기가 특별한지, 육수/숙성/조리 비법 등)
   - 현실적인 꿀팁 (웨이팅 시간대, 캐치테이블/원격 줄서기 여부, 룸 예약 팁, 주차 정보)
3. 만약 '코스'나 '데이트'를 물어보면 [점심 식사 -> 디저트/카페 -> 저녁/와인/위스키/포차 2차]로 이어지는 도보 이동 가능한 낭만적인 식도락 코스를 제안하세요.
4. 마크다운 형식(제목, 볼드, 불릿포인트)으로 가독성 높고 정갈하게 작성해주세요.`;

    const userMessage = `
[사용자 요청 상황]
- 질문/요청: ${prompt || "서울 맛집 추천"}
${district ? `- 선호 지역: ${district}` : ""}
${occasion ? `- 모임/상황: ${occasion}` : ""}
${budget ? `- 예산대: ${budget}` : ""}
${cuisinePreference ? `- 선호 음식 종류: ${cuisinePreference}` : ""}

위 조건에 맞는 최고의 서울 미식 가이드를 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "추천 정보를 생성하지 못했습니다. 다시 시도해주세요.";
    res.json({ result: reply });
  } catch (error: any) {
    console.error("AI Sommelier Error:", error);
    res.status(500).json({ 
      error: "AI 미식 추천을 불러오는 중 오류가 발생했습니다.", 
      details: error?.message 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Seoul Gourmet Guide Server running on http://localhost:${PORT}`);
  });
}

startServer();
