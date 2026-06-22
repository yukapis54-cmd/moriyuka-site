"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

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
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Mail size={22} />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            NEWSLETTER
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            島暮らし1人事業
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
            島での暮らし、ナマコ事業、SNS発信の裏側を月数回のメルマガでお届け。脱サラ・SNS・EC・LINE公式のノウハウをまとめた無料ガイドも、登録者へ先行配布予定です。
            <br className="hidden md:block" />
            登録は無料です。
          </p>

          {submitted ? (
            <p className="mt-8 rounded-full bg-white/15 px-6 py-3 text-sm font-medium">
              ご登録ありがとうございます！
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
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
                {status === "loading" ? "送信中…" : "事前登録する"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm font-medium text-sand-200">
              送信に失敗しました。時間をおいて再度お試しください。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
