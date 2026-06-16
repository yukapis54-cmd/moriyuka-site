"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section bg-white">
      <div className="container-base">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center md:mb-14">
            <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
              CONTACT
            </p>
            <h2 className="section-title">お問い合わせ</h2>
            <p className="mt-4 text-sm leading-relaxed text-ocean-800 md:text-base">
              お仕事のご依頼、取材、コラボのご相談はこちらから。
            </p>
          </div>

          {submitted ? (
            <p className="rounded-2xl border border-ocean-100 bg-ocean-50 p-6 text-center text-sm font-medium text-ocean-900">
              送信ありがとうございました（デモ表示）
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-ocean-900"
                >
                  お名前
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-ocean-900"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-ocean-900"
                >
                  本文
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-500"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn-primary">
                  送信する
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
