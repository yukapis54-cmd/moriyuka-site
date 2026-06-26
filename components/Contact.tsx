"use client";

import { useState } from "react";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ACCESS_KEY) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "【もりゆか】お問い合わせ",
          from_name: "MORIYUKA Contact",
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const submitted = status === "success";

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
              お仕事のご依頼、コラボのご相談はこちらから。
            </p>
          </div>

          {submitted ? (
            <p className="rounded-2xl border border-ocean-100 bg-ocean-50 p-6 text-center text-sm font-medium text-ocean-900">
              送信ありがとうございました！
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
                  name="name"
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
                  name="email"
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
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded-xl border border-ocean-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-500"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary disabled:opacity-60"
                >
                  {status === "loading" ? "送信中…" : "送信する"}
                </button>
                {status === "error" && (
                  <p className="mt-4 text-sm font-medium text-red-600">
                    送信に失敗しました。時間をおいて再度お試しください。
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
