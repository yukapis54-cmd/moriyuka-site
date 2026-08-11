import type { PhotoDto } from "./types";
import seed from "../../../data/photo-cache.json";

/**
 * 写真検索結果の永続キャッシュ。
 * Unsplash の Demo キーは 50 リクエスト/時しかないため、一度取れた結果は使い回す。
 *
 * Cloudflare Workers にはファイルシステムが無いので、リポジトリに同梱した
 * data/photo-cache.json は「実行時に読む」のではなく import でバンドルへ含める。
 * ディスクへの書き戻しは開発時だけ（node:fs は動的 import で、無い環境では黙って諦める）。
 */
const CACHE_FILE_REL = ["data", "photo-cache.json"];

type Entry = { at: number; photos: PhotoDto[] };
type CacheShape = Record<string, Entry>;

const memory: CacheShape = { ...(seed as unknown as CacheShape) };

export function cacheGet(key: string): PhotoDto[] | null {
  const entry = memory[key];
  if (!entry || !entry.photos?.length) return null;
  return entry.photos;
}

export function cacheSet(key: string, photos: PhotoDto[]) {
  if (!photos.length) return;
  // n が小さい呼び出しで、既に持っている多い方の結果を潰さない
  if ((memory[key]?.photos?.length ?? 0) >= photos.length) return;
  memory[key] = { at: Date.now(), photos };
  if (process.env.NODE_ENV === "production") return; // 本番では書き込まない
  void persist();
}

/** 開発時のみ、取得できた写真をリポジトリのキャッシュへ書き戻す */
async function persist() {
  try {
    const [fs, path] = await Promise.all([import("node:fs"), import("node:path")]);
    const file = path.join(process.cwd(), ...CACHE_FILE_REL);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // 書き込み途中で落ちても壊れないよう、一時ファイル経由で差し替える
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(memory, null, 2));
    fs.renameSync(tmp, file);
  } catch {
    /* 書けなくてもメモリ上のキャッシュは効く */
  }
}
