// lib/gemini.ts
// เรียก Gemini, build prompt, log tokens

import { GoogleGenAI } from "@google/genai";

const DEFAULT_REPLY =
  "ขออภัยค่ะ น้องเล่ย์ยังไม่มีข้อมูลส่วนนี้ รบกวนติดต่อพนักงานโดยตรงได้เลยนะคะ 🙏";

function buildPrompt(faqCsv: string, userMessage: string): string {
  return `
<role>
  คุณคือน้องเล่ย์ พนักงานของร้านพิซซ่า
  หน้าที่ของคุณคือตอบคำถามลูกค้าทาง LINE อย่างสุภาพและเป็นมิตร
</role>

<constraints>
  - ตอบโดยใช้ข้อมูลใน <faq> เท่านั้น
  - ห้ามแต่งหรือเดาราคา เวลา สถานที่ หรือโปรโมชันที่ไม่มีใน FAQ
  - ถ้าไม่มีข้อมูลในการตอบ ให้ตอบว่า "${DEFAULT_REPLY}" เท่านั้น ห้ามแต่งคำตอบเอง
  - โทนภาษา: สุภาพ เป็นทางการ ใช้ "ค่ะ" ลงท้าย ใช้ emoji ได้ 1-2 ตัวต่อข้อความ
  - ความยาว: 1-3 ประโยคเท่านั้น กระชับ ตรงประเด็น
</constraints>

<output_format>
  - ภาษาไทยเท่านั้น
  - ห้ามใช้ markdown เช่น **, ##, bullet
  - ห้ามขึ้นต้นด้วย "แน่นอน" "โอเค" หรือคำสร้อยที่ไม่จำเป็น
</output_format>

<faq>
${faqCsv || "(ไม่มีข้อมูล FAQ ในขณะนี้)"}
</faq>

<question>
${userMessage}
</question>
`.trim();
}

export async function askGemini(
  faqCsv: string,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[gemini] GEMINI_API_KEY is not set");
    return DEFAULT_REPLY;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(faqCsv, userMessage);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
        maxOutputTokens: 1024,
      },
    });

    // ── log tokens ทุก request ──
    const candidate = response.candidates?.[0];
    const finishReason = candidate?.finishReason ?? "UNKNOWN";
    const thoughtsTokenCount =
      response.usageMetadata?.thoughtsTokenCount ?? 0;
    const candidatesTokenCount =
      response.usageMetadata?.candidatesTokenCount ?? 0;

    console.log(
      `[gemini] finishReason=${finishReason}`,
      `thoughtsTokens=${thoughtsTokenCount}`,
      `candidatesTokens=${candidatesTokenCount}`
    );

    // ── ถ้าตัดกลางทาง → ส่ง default แทน ──
    if (finishReason === "MAX_TOKENS") {
      console.warn("[gemini] MAX_TOKENS reached — returning default reply");
      return DEFAULT_REPLY;
    }

    const text = response.text ?? "";
    if (!text.trim()) {
      console.warn("[gemini] empty response — returning default reply");
      return DEFAULT_REPLY;
    }

    return text.trim();
  } catch (err) {
    console.error("[gemini] generateContent failed:", err);
    return DEFAULT_REPLY;
  }
}
