const items = [
  { label: "SNS総フォロワー", value: "14,000+" },
  { label: "月間SNS閲覧数", value: "105万回以上" },
  { label: "EC販売実績", value: "100セット以上" },
  { label: "事業立ち上げ", value: "6ヶ月目" },
];

export default function Kpi() {
  return (
    <section className="section bg-white">
      <div className="container-base">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((it) => (
            <div
              key={it.label}
              className="rounded-2xl border border-ocean-100 bg-ocean-50/50 p-5 text-center md:p-8"
            >
              <p className="text-xs font-medium text-ocean-700 md:text-sm">
                {it.label}
              </p>
              <p className="mt-2 break-words text-lg font-bold text-ocean-950 md:text-2xl">
                {it.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
