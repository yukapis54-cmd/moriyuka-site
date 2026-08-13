"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Send } from "lucide-react";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type SummaryItem = {
  label: string;
  value: string;
};

type LeadFormProps = {
  summary: SummaryItem[];
};

const budgetOptions = [
  "30万円未満",
  "30万円〜50万円",
  "50万円〜100万円",
  "100万円以上",
  "まだ決まっていない",
];

const timelineOptions = [
  "1か月以内",
  "2〜3か月以内",
  "半年以内",
  "急ぎではない",
  "相談して決めたい",
];

export default function LeadForm({ summary }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ACCESS_KEY) {
      setStatus("error");
      setMessage("送信設定が未完了です。NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY を設定してください。");
      return;
    }

    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const diagnosisSummary = summary
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");
    const hiddenDiagnosisFields = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key.startsWith("diagnosis_"))
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "【もりゆか】デザイン診断からの制作相談",
          from_name: "MORIYUKA Design Diagnosis",
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          budget: formData.get("budget"),
          timeline: formData.get("timeline"),
          message: formData.get("message"),
          diagnosis_summary: diagnosisSummary,
          ...hiddenDiagnosisFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Web3Forms request failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("送信に失敗しました。時間をおいて再度お試しください。");
    }
  };

  if (status === "success") {
    return (
      <section id="start" className="bg-[#fbfaf6] px-5 py-16 text-ocean-950 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl border-t border-ocean-950/10 pt-10">
          <p className="text-xs font-bold tracking-[0.28em] text-ocean-700">CONTACT</p>
          <h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">送信しました</h2>
          <p className="mt-5 text-sm leading-7 text-ocean-950/68 md:text-base">
            診断結果とご相談内容を受け付けました。内容を確認して、制作相談についてご連絡します。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="start" className="bg-[#fbfaf6] px-5 py-16 text-ocean-950 md:px-8 md:py-24">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 border-t border-ocean-950/10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-ocean-700">CONTACT</p>
            <h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
              診断結果をもとに、制作相談へ進む。
            </h2>
            <p className="mt-5 text-sm leading-7 text-ocean-950/68 md:text-base">
              好きな方向性はそのまま共有されます。事業の内容や予算感だけを追加して送ってください。
            </p>

            <div className="mt-10 border-y border-ocean-950/10 py-2">
              {summary.length > 0 ? (
                <dl className="divide-y divide-ocean-950/10">
                  {summary.map((item) => (
                    <div key={`${item.label}-${item.value}`} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
                      <dt className="text-xs font-bold tracking-[0.16em] text-ocean-950/50">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-medium leading-6 text-ocean-950">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="py-4 text-sm leading-7 text-ocean-950/60">
                  診断結果はまだありません。フォームは送信できますが、先に診断を完了すると相談が進めやすくなります。
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {summary.map((item, index) => (
              <input
                key={`${item.label}-${index}`}
                type="hidden"
                name={`diagnosis_${index + 1}`}
                value={`${item.label}: ${item.value}`}
              />
            ))}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="名前" htmlFor="name">
                <input id="name" name="name" type="text" required className={inputClassName} />
              </Field>
              <Field label="会社名・店舗名" htmlFor="company">
                <input id="company" name="company" type="text" required className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="メール" htmlFor="email">
                <input id="email" name="email" type="email" required className={inputClassName} />
              </Field>
              <Field label="電話番号（任意）" htmlFor="phone">
                <input id="phone" name="phone" type="tel" className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="希望予算" htmlFor="budget">
                <select id="budget" name="budget" required defaultValue="" className={inputClassName}>
                  <option value="" disabled>
                    選択してください
                  </option>
                  {budgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="希望納期" htmlFor="timeline">
                <select id="timeline" name="timeline" required defaultValue="" className={inputClassName}>
                  <option value="" disabled>
                    選択してください
                  </option>
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="相談内容" htmlFor="message">
              <textarea id="message" name="message" required rows={7} className={inputClassName} />
            </Field>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ocean-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-ocean-900/15 transition hover:bg-ocean-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Send size={17} strokeWidth={1.8} aria-hidden="true" />
                {status === "loading" ? "送信中..." : "制作相談を送信する"}
              </button>
              {status === "error" && (
                <p className="mt-4 text-sm font-medium leading-6 text-red-600">{message}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ocean-950">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-md border border-ocean-950/15 bg-white px-4 py-3 text-sm text-ocean-950 outline-none transition placeholder:text-ocean-950/35 focus:border-ocean-700 focus:ring-2 focus:ring-ocean-700/15";
