import { NextResponse } from "next/server";

const API_KEY = process.env.KIT_API_KEY;
const BASE = "https://api.kit.com/v4";
const FORM_ID = "9585444";
const SEQUENCE_ID = "2801783"; // 「ウェルカム」シーケンス（登録時にお礼メールを送信）

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Kit-Api-Key": API_KEY,
  };
  const payload = JSON.stringify({ email_address: email });

  try {
    // 1) 購読者を作成（既存ならそのまま）
    await fetch(`${BASE}/subscribers`, { method: "POST", headers, body: payload });
    // 2) フォーム（リスト）に追加
    await fetch(`${BASE}/forms/${FORM_ID}/subscribers`, {
      method: "POST",
      headers,
      body: payload,
    });
    // 3) ウェルカムシーケンスに登録（お礼メールが送られる）
    const seq = await fetch(`${BASE}/sequences/${SEQUENCE_ID}/subscribers`, {
      method: "POST",
      headers,
      body: payload,
    });
    if (!seq.ok) {
      return NextResponse.json({ error: "subscribe_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "subscribe_failed" }, { status: 502 });
  }
}
