"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(
        "https://app.kit.com/forms/9585444/subscriptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email_address: email }),
        }
      );
      const data = await res.json().catch(() => ({}));
      setStatus(res.ok && data.status !== "error" ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const submitted = status === "success";

  return (
    <section id="newsletter" className="section bg-white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-ocean-700 to-ocean-900 px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            FOLLOW &amp; SUBSCRIBE
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">島暮らし1人事業</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
            島での暮らし、ナマコ事業、SNS発信の裏側をお届け。
            <br className="hidden md:block" />
            まずは公式LINEがおすすめです（登録は無料）。
          </p>

          {/* 公式LINE（メイン） */}
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white/10 p-6">
            <p className="text-sm font-semibold text-white">
              公式LINEで受け取る（おすすめ）
            </p>
            <a
              href="https://lin.ee/5obSpak"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#06C755] px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 sm:w-auto md:text-base"
            >
              <MessageCircle size={18} className="mr-2" />
              公式LINEを友だち追加
            </a>
          </div>

          {/* メルマガ（サブ） */}
          <div className="mx-auto mt-6 max-w-md">
            <p className="text-sm text-white/80">
              メールで受け取りたい方はこちら（メルマガ）
            </p>
            {submitted ? (
              <p className="mt-4 rounded-full bg-white/15 px-6 py-3 text-sm font-medium">
                ご登録ありがとうございます！
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white focus:bg-white/15"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-sand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sand-600 disabled:opacity-60"
                >
                  {status === "loading" ? "送信中…" : "登録する"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm font-medium text-sand-200">
                送信に失敗しました。時間をおいて再度お試しください。
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
