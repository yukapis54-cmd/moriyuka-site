import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 写真キャッシュはバンドル同梱の JSON（app/api/photos/cache.ts）で完結するため、
// ここでは KV などのインクリメンタルキャッシュは使わない。
export default defineCloudflareConfig();
