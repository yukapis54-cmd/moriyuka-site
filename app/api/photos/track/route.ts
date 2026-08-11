import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/photos/track { downloadLocation }
 * Unsplash API ガイドライン準拠：写真を実際に利用したタイミングで download を記録する。
 */
export async function POST(request: Request) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ ok: false, reason: "no-key" });

  let downloadLocation = "";
  try {
    const body = (await request.json()) as { downloadLocation?: string };
    downloadLocation = body.downloadLocation ?? "";
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-body" });
  }
  // 任意の Unsplash エンドポイントを叩ける踏み台にしないため、download エンドポイントだけ許可する
  let loc: URL;
  try {
    loc = new URL(downloadLocation);
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-location" });
  }
  const isDownloadEndpoint =
    loc.protocol === "https:" &&
    loc.hostname === "api.unsplash.com" &&
    /^\/photos\/[A-Za-z0-9_-]+\/download$/.test(loc.pathname);
  if (!isDownloadEndpoint) {
    return NextResponse.json({ ok: false, reason: "bad-location" });
  }
  downloadLocation = loc.toString();

  try {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "network" });
  }
}
