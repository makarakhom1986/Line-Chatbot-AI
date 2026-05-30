// app/api/line-webhook/route.ts
// รับ LINE event → ดึง FAQ → ถาม Gemini → ส่ง reply

import { NextRequest, NextResponse } from "next/server";
import {
  messagingApi,
  validateSignature,
  WebhookEvent,
  TextMessage,
} from "@line/bot-sdk";
import { getFaqCsv } from "@/lib/sheet";
import { askGemini } from "@/lib/gemini";

const { MessagingApiClient } = messagingApi;

// ── LINE client ──
function getLineClient() {
  return new MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",
  });
}

// ── verify signature ──
async function verifyLineSignature(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  const signature = req.headers.get("x-line-signature") ?? "";
  const secret = process.env.LINE_CHANNEL_SECRET ?? "";
  return validateSignature(rawBody, secret, signature);
}

// ── handler หลัก ──
export async function POST(req: NextRequest) {
  // 1. อ่าน raw body ก่อน (ต้องใช้ verify signature)
  const rawBody = await req.text();

  // 2. verify signature
  const isValid = await verifyLineSignature(req, rawBody);
  if (!isValid) {
    console.warn("[webhook] invalid signature — rejected");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. parse body
  let body: { events: WebhookEvent[] };
  try {
    body = JSON.parse(rawBody);
  } catch {
    console.error("[webhook] JSON parse failed");
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const events = body.events ?? [];

  // 4. process แต่ละ event (ไม่ await รวม เพื่อความเร็ว)
  await Promise.all(
    events.map(async (event) => {
      // กรองเฉพาะ text message เท่านั้น
      if (
        event.type !== "message" ||
        event.message.type !== "text" ||
        !event.replyToken
      ) {
        console.log(`[webhook] skipped event type=${event.type}`);
        return;
      }

      const userMessage = event.message.text.trim();
      const replyToken = event.replyToken;

      console.log(`[webhook] userMessage="${userMessage}"`);

      // 5. ดึง FAQ
      const faqCsv = await getFaqCsv();

      // 6. ถาม Gemini
      const replyText = await askGemini(faqCsv, userMessage);

      // 7. ส่ง reply กลับ LINE
      try {
        const client = getLineClient();
        const replyMessage: TextMessage = {
          type: "text",
          text: replyText,
        };
        await client.replyMessage({
          replyToken,
          messages: [replyMessage],
        });
        console.log(`[webhook] replied OK — "${replyText.slice(0, 60)}..."`);
      } catch (err) {
        console.error(
          `[webhook] replyMessage failed replyToken=${replyToken}`,
          err
        );
      }
    })
  );

  // LINE ต้องการ 200 เสมอ ไม่งั้น retry
  return NextResponse.json({ ok: true }, { status: 200 });
}
