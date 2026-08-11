import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** 画像をこのサーバー経由で返す。canvas が汚染されず toDataURL() が通る。 */
const ALLOWED_HOSTS = new Set([
  "images.unsplash.com",
  "live.staticflickr.com",
  "farm1.staticflickr.com",
  "farm2.staticflickr.com",
  "farm3.staticflickr.com",
  "farm4.staticflickr.com",
  "farm5.staticflickr.com",
  "farm66.staticflickr.com",
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "api.openverse.org",
  "pixabay.com",
  "pexels.com",
]);

/** 画像 CDN はサブドメインが多いので接尾辞でも許可する */
const ALLOWED_SUFFIXES = [
  ".staticflickr.com",
  ".unsplash.com",
  ".wikimedia.org",
  ".openverse.org",
  ".rawpixel.com",
  ".stocksnap.io",
  ".nasa.gov",
  ".smithsonian.com",
  ".si.edu",
  ".museumsvictoria.com.au",
  ".statlib.org",
  ".spacetelescope.org",
  ".eso.org",
  ".nypl.org",
  ".getarchive.net",
  ".finna.fi",
  ".sciencemuseumgroup.org.uk",
  ".pexels.com",
  ".pixabay.com",
];

function isAllowed(hostname: string): boolean {
  return ALLOWED_HOSTS.has(hostname) || ALLOWED_SUFFIXES.some((s) => hostname.endsWith(s));
}

const MAX_BYTES = 12 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);

  // 他サイトからのホットリンクを弾く（同一オリジンからの利用だけ許可）
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const sameOrigin = (value: string | null) => {
    if (!value) return true; // 直リンク（Origin/Referer なし）は許可：canvas の画像読込を壊さない
    try {
      return new URL(value).host === reqUrl.host;
    } catch {
      return false;
    }
  };
  if (!sameOrigin(origin) || !sameOrigin(referer)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const src = reqUrl.searchParams.get("u");
  if (!src) return new NextResponse("missing u", { status: 400 });

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new NextResponse("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !isAllowed(target.hostname)) {
    return new NextResponse("host not allowed", { status: 403 });
  }

  try {
    // リダイレクトは手動で追い、飛び先も必ず許可ホストか検査する（オープンリダイレクト経由の SSRF 対策）
    let current = target;
    let res: Response | null = null;
    for (let hop = 0; hop < 3; hop++) {
      res = await fetch(current.toString(), {
        headers: { "User-Agent": "moriyuka-site/1.0 (ideal-hp mockup generator)" },
        redirect: "manual",
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        next: { revalidate: 86400 },
      });
      if (res.status < 300 || res.status >= 400) break;
      const loc = res.headers.get("location");
      if (!loc) return new NextResponse("bad redirect", { status: 502 });
      const next = new URL(loc, current);
      if (next.protocol !== "https:" || !isAllowed(next.hostname)) {
        return new NextResponse("redirect host not allowed", { status: 403 });
      }
      current = next;
      res = null;
    }
    if (!res || !res.ok || !res.body) return new NextResponse("upstream error", { status: 502 });

    // 過大なファイルは中継しない（content-length が無い/壊れている場合もストリームで打ち切る）
    const declared = Number(res.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      return new NextResponse("image too large", { status: 413 });
    }

    const type = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim();
    // SVG は同一オリジンでスクリプトが動くため中継しない
    if (!RASTER_TYPES.has(type)) return new NextResponse("unsupported image type", { status: 415 });

    let transferred = 0;
    const capped = res.body.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          transferred += chunk.byteLength;
          if (transferred > MAX_BYTES) {
            controller.error(new Error("image too large"));
            return;
          }
          controller.enqueue(chunk);
        },
      }),
    );

    return new NextResponse(capped, {
      headers: {
        "Content-Type": type,
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline; filename=\"photo\"",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("fetch failed", { status: 502 });
  }
}

const RASTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
