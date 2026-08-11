#!/usr/bin/env bash
# タスク完了(Stop)時に、直近コミットの差分を Codex と Claude の両方で監査する。
# 同じコミットは一度だけ監査（.last-audit-sha でガード）＝毎回のStopでは走らない。
set -u

PROJECT="/Users/yukamori/moriyuka-site"
cd "$PROJECT" 2>/dev/null || exit 0
command -v git >/dev/null 2>&1 || exit 0

HEAD_SHA="$(git rev-parse HEAD 2>/dev/null)" || exit 0
STATE="$PROJECT/.claude/.last-audit-sha"

# このコミットを既に監査済みなら何もしない（ループ・重複防止）
[ "$HEAD_SHA" = "$(cat "$STATE" 2>/dev/null)" ] && exit 0
echo "$HEAD_SHA" > "$STATE"

# 直近コミットの差分（無ければ未コミット差分）。大きすぎる場合は先頭を切る。
DIFF="$(git diff HEAD~1 HEAD 2>/dev/null | head -c 20000)"
[ -z "$DIFF" ] && DIFF="$(git diff 2>/dev/null | head -c 20000)"
[ -z "$DIFF" ] && exit 0

PROMPT="次のgit diffをコードレビュー・監査してください。バグ・不具合・セキュリティ問題・明らかな改善点だけを、日本語の短い箇条書きで指摘。問題が無ければ「問題なし」の一言。前置きは不要。

\`\`\`diff
${DIFF}
\`\`\`"

LOGDIR="$PROJECT/.claude/audit-log"
mkdir -p "$LOGDIR"
LOG="$LOGDIR/$(date +%Y%m%d-%H%M%S)-${HEAD_SHA:0:7}.md"

TMPC="$(mktemp)"; TMPCL="$(mktemp)"
TOOL_TIMEOUT=150   # 各ツール個別のタイムアウト秒（ハング対策）

# perl の alarm で個別タイムアウトを付けて Codex / Claude を並列実行
if command -v codex >/dev/null 2>&1; then
  perl -e 'alarm shift @ARGV; exec @ARGV' "$TOOL_TIMEOUT" codex exec --skip-git-repo-check "$PROMPT" >"$TMPC" 2>/dev/null &
  CPID=$!
fi
if command -v claude >/dev/null 2>&1; then
  perl -e 'alarm shift @ARGV; exec @ARGV' "$TOOL_TIMEOUT" claude -p "$PROMPT" >"$TMPCL" 2>/dev/null &
  LPID=$!
fi
[ -n "${CPID:-}" ] && wait "$CPID" 2>/dev/null
[ -n "${LPID:-}" ] && wait "$LPID" 2>/dev/null

CODEX_OUT="$(tail -n 40 "$TMPC" 2>/dev/null)"; [ -z "$CODEX_OUT" ] && CODEX_OUT="(codex 出力なし／タイムアウトの可能性)"
CLAUDE_OUT="$(cat "$TMPCL" 2>/dev/null)"; [ -z "$CLAUDE_OUT" ] && CLAUDE_OUT="(claude 出力なし／タイムアウトの可能性)"
rm -f "$TMPC" "$TMPCL"

{
  echo "# 監査レポート  commit ${HEAD_SHA:0:7}  ($(date '+%Y-%m-%d %H:%M'))"
  echo; echo "## Codex"; echo "$CODEX_OUT"
  echo; echo "## Claude"; echo "$CLAUDE_OUT"
} > "$LOG"

# ユーザーに結果を表示（Stopは通常どおり終了させる）
python3 - "$LOG" "$CODEX_OUT" "$CLAUDE_OUT" <<'PY'
import json, sys
log, codex, claude = sys.argv[1], sys.argv[2], sys.argv[3]
cap = lambda s, n=1500: s if len(s) <= n else s[:n] + " …(省略)"
msg = ("🔍 タスク完了 監査（Codex + Claude）\n"
       f"ログ: {log}\n\n"
       f"【Codex】\n{cap(codex)}\n\n"
       f"【Claude】\n{cap(claude)}")
print(json.dumps({"systemMessage": msg, "continue": True, "suppressOutput": True}))
PY
exit 0
