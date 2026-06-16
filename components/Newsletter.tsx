"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            島から、もりゆか
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
            島での暮らし、ナマコ事業、SNS発信の裏側を月数回のメルマガでお届け。
            <br className="hidden md:block" />
            登録は無料です。
          </p>

          {submitted ? (
            <p className="mt-8 rounded-full bg-white/15 px-6 py-3 text-sm font-medium">
              登録ありがとうございます（デモ表示）
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
                className="rounded-full bg-sand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sand-600"
              >
                登録する
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
