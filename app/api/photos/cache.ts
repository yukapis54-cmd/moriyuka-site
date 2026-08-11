import fs from "node:fs";
import path from "node:path";
import type { PhotoDto } from "./types";

/**
 * 写真検索結果の永続キャッシュ。
 * Unsplash の Demo キーは 50 リクエスト/時しかないため、一度取れた結果はディスクに残して使い回す。
 * 本番（読み取り専用FS）ではリポジトリに含めたキャッシュを読むだけ。書き込みは開発時のみ。
 */
const CACHE_FILE = path.join(process.cwd(), "data", "photo-cache.json");

type CacheShape = Record<string, { at: number; photos: PhotoDto[] }>;

let memory: CacheShape | null = null;

function load(): CacheShape {
  if (memory) return memory;
  try {
    memory = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as CacheShape;
  } catch {
    memory = {};
  }
  return memory;
}

export function cacheGet(key: string): PhotoDto[] | null {
  const entry = load()[key];
  if (!entry || !entry.photos?.length) return null;
  return entry.photos;
}

export function cacheSet(key: string, photos: PhotoDto[]) {
  if (!photos.length) return;
  const store = load();
  // n が小さい呼び出しで、既に持っている多い方の結果を潰さない
  if ((store[key]?.photos?.length ?? 0) >= photos.length) return;
  store[key] = { at: Date.now(), photos };
  if (process.env.NODE_ENV === "production") return; // 本番では書き込まない
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    // 書き込み途中で落ちても壊れないよう、一時ファイル経由で差し替える
    const tmp = `${CACHE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
    fs.renameSync(tmp, CACHE_FILE);
  } catch {
    /* 書けなくてもメモリ上のキャッシュは効く */
  }
}
