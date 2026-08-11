/**
 * 診断結果を「UI パターンの名前」に翻訳する。
 *
 * 狙い: 完成イメージを見ても「あの部分、なんて頼めばいいの？」で止まってしまうので、
 * 使われている型に正式名称を与えて、そのまま AI や制作会社への指示に使えるようにする。
 */

export type UiPattern = {
  /** AI に伝わる英語名。指示のときはこれを使う */
  en: string;
  /** 日本語での呼び方 */
  ja: string;
  /** 何のための型か（1行） */
  desc: string;
  category: "ナビゲーション" | "ヒーロー" | "レイアウト" | "フォーム・CTA" | "コンテンツ" | "スタイル";
};

type Key = "industry" | "goal" | "tone" | "palette" | "layout" | "hero" | "density";
type Answers = Record<Key, string>;

/** どの回答でも必ず要る土台 */
const BASE: UiPattern[] = [
  {
    en: "Sticky Header",
    ja: "追従ヘッダー",
    desc: "スクロールしても上部に残るナビ。どこにいても次の行動に移れる",
    category: "ナビゲーション",
  },
  {
    en: "Hamburger Menu",
    ja: "ハンバーガーメニュー",
    desc: "スマホで三本線を押すと開くメニュー。項目が5つ以上なら必須",
    category: "ナビゲーション",
  },
  {
    en: "Footer Sitemap",
    ja: "フッターサイトマップ",
    desc: "全ページへのリンクと会社情報をまとめた最下部",
    category: "ナビゲーション",
  },
];

const BY_LAYOUT: Record<string, UiPattern[]> = {
  fullhero: [
    {
      en: "Full-Bleed Hero",
      ja: "全面ヒーロー",
      desc: "画面いっぱいの写真1枚に見出しを重ねる。世界観が一撃で伝わる",
      category: "ヒーロー",
    },
    {
      en: "Scroll Indicator",
      ja: "スクロール誘導",
      desc: "「下に続きがある」と気づかせる矢印。全面ヒーローとセットで使う",
      category: "ヒーロー",
    },
  ],
  split: [
    {
      en: "Split Hero",
      ja: "左右分割ヒーロー",
      desc: "片側に写真、片側に見出しとボタン。読ませたい文がある人向け",
      category: "ヒーロー",
    },
  ],
  card: [
    {
      en: "Card Grid",
      ja: "カードグリッド",
      desc: "同じ形の箱を並べる。商品やメニューが多いときの基本形",
      category: "レイアウト",
    },
    {
      en: "Filter Chips",
      ja: "絞り込みチップ",
      desc: "カードの上に置く丸いタグ。種類が10個を超えたら効く",
      category: "レイアウト",
    },
  ],
  magazine: [
    {
      en: "Editorial Layout",
      ja: "雑誌風レイアウト",
      desc: "文字組みと余白で読ませる。ストーリーを伝えたいとき",
      category: "レイアウト",
    },
    {
      en: "Pull Quote",
      ja: "引用の抜き出し",
      desc: "本文の一節を大きく抜き出す。長文の途中で目を止めさせる",
      category: "コンテンツ",
    },
  ],
};

const BY_HERO: Record<string, UiPattern[]> = {
  person: [
    {
      en: "Portrait Hero",
      ja: "人物ヒーロー",
      desc: "作り手の顔を主役に据える。個人事業でいちばん信頼が乗る型",
      category: "ヒーロー",
    },
  ],
  product: [
    {
      en: "Product Shot Hero",
      ja: "商品ヒーロー",
      desc: "商品の寄り写真を主役に。シズル感がそのまま購買につながる",
      category: "ヒーロー",
    },
  ],
  scenery: [
    {
      en: "Image Backdrop",
      ja: "背景写真",
      desc: "産地や現場を敷いて空気感を伝える。文字は必ず暗幕を敷いて読ませる",
      category: "ヒーロー",
    },
  ],
  logo: [
    {
      en: "Typographic Hero",
      ja: "タイポグラフィ・ヒーロー",
      desc: "写真を使わず文字だけで組む。良い写真が無くても成立する",
      category: "ヒーロー",
    },
  ],
};

const BY_GOAL: Record<string, UiPattern[]> = {
  shop: [
    {
      en: "Product Card",
      ja: "商品カード",
      desc: "写真・名前・価格・ボタンを1枚に収めた最小単位",
      category: "コンテンツ",
    },
    {
      en: "Sticky Buy Bar",
      ja: "追従購入バー",
      desc: "スマホの下に貼り付く購入ボタン。離脱を大きく減らす",
      category: "フォーム・CTA",
    },
  ],
  lead: [
    {
      en: "Inline Form",
      ja: "埋め込みフォーム",
      desc: "問い合わせを別ページに飛ばさず、その場で入力させる",
      category: "フォーム・CTA",
    },
    {
      en: "Inline Validation",
      ja: "入力時チェック",
      desc: "送信前にその場でエラーを出す。フォーム離脱の主因を潰す",
      category: "フォーム・CTA",
    },
  ],
  brand: [
    {
      en: "Story Section",
      ja: "ストーリー節",
      desc: "なぜやっているかを時系列で見せる。共感で選ばれるための土台",
      category: "コンテンツ",
    },
    {
      en: "Image Gallery",
      ja: "画像ギャラリー",
      desc: "作品や現場をまとめて見せる。写真の力で語る",
      category: "コンテンツ",
    },
  ],
  fan: [
    {
      en: "Newsletter Signup Block",
      ja: "メルマガ登録ブロック",
      desc: "メールだけで登録できる帯。特典を1行添えると登録率が変わる",
      category: "フォーム・CTA",
    },
    {
      en: "Social Proof",
      ja: "実績・声の提示",
      desc: "フォロワー数やお客様の声。初見の人が信じる材料になる",
      category: "コンテンツ",
    },
  ],
};

const BY_DENSITY: Record<string, UiPattern[]> = {
  light: [
    {
      en: "Above-the-Fold CTA",
      ja: "ファーストビューCTA",
      desc: "スクロール前にボタンを見せる。短いページほど効く",
      category: "フォーム・CTA",
    },
  ],
  balanced: [
    {
      en: "Alternating Feature Rows",
      ja: "左右交互の紹介行",
      desc: "写真と文を左右入れ替えながら並べる。読み疲れない定番",
      category: "レイアウト",
    },
  ],
  heavy: [
    {
      en: "Table of Contents",
      ja: "目次",
      desc: "長いページの冒頭に置く。読者が読む前に全体像を掴める",
      category: "ナビゲーション",
    },
    {
      en: "Accordion",
      ja: "アコーディオン",
      desc: "見出しを押すと開く折りたたみ。FAQ はこれ一択",
      category: "コンテンツ",
    },
  ],
};

const BY_TONE: Record<string, UiPattern[]> = {
  natural: [
    { en: "Rounded Cards", ja: "角丸カード", desc: "角を大きく丸める。やわらかく親しみやすい印象", category: "スタイル" },
  ],
  modern: [
    { en: "Generous Whitespace", ja: "余白多め", desc: "要素を減らし余白で見せる。高く見える最短ルート", category: "スタイル" },
  ],
  premium: [
    { en: "Serif Display Type", ja: "明朝の大見出し", desc: "細い明朝を大きく置く。落ち着きと品が出る", category: "スタイル" },
  ],
  pop: [
    { en: "Oversized Type", ja: "極太・特大文字", desc: "見出しを画面幅いっぱいに。勢いと元気さが出る", category: "スタイル" },
  ],
  wamodern: [
    { en: "Vertical Writing", ja: "縦書き", desc: "CSS の writing-mode で縦組みにする。和の看板らしさが出る", category: "スタイル" },
  ],
  patisserie: [
    { en: "Arch Frame", ja: "アーチ型の切り抜き", desc: "写真の上辺を半円に。洋菓子店・サロンで定番", category: "スタイル" },
  ],
  popwa: [
    { en: "Oversized Type", ja: "極太・特大文字", desc: "見出しを画面幅いっぱいに。勢いと元気さが出る", category: "スタイル" },
  ],
  cinema: [
    { en: "Dark Theme", ja: "ダークテーマ", desc: "黒背景に白文字。写真と映像がいちばん映える", category: "スタイル" },
  ],
};

/** 回答から、この完成イメージが使っている UI パターンを組み立てる */
export function patternsFor(a: Answers): UiPattern[] {
  const all = [
    ...(BY_LAYOUT[a.layout] ?? []),
    ...(BY_HERO[a.hero] ?? []),
    ...(BY_GOAL[a.goal] ?? []),
    ...(BY_DENSITY[a.density] ?? []),
    ...(BY_TONE[a.tone] ?? []),
    ...BASE,
  ];
  // 同じ型が別軸から重複して出ることがある（Oversized Type など）
  const seen = new Set<string>();
  return all.filter((p) => (seen.has(p.en) ? false : (seen.add(p.en), true)));
}

/* ============================ 「なんか良い」の種明かし ============================ */

export type DesignReason = {
  /** 何の話か（例: 視線の順番） */
  title: string;
  /** なぜそう見えるのか。専門用語は使わず、選んだ内容に紐づけて書く */
  body: string;
};

const HERO_SUBJECT: Record<string, string> = {
  person: "人の顔",
  product: "商品",
  scenery: "風景",
  logo: "大きな文字",
};

const LAYOUT_FLOW: Record<string, string> = {
  fullhero: "写真全体 → 中央の見出し → ボタン",
  split: "左の写真 → 右の見出し → ボタン",
  card: "1枚目のカード → 右へ順番に → 気になったものをクリック",
  magazine: "大きな見出し → 写真 → 本文",
};

/**
 * 完成イメージが「なんか良い」理由を、選んだ内容に沿って言語化する。
 * 感覚で終わらせず、自分のサイトを直すときの判断基準として持ち帰ってもらうのが狙い。
 */
export function reasonsFor(a: Answers, paletteName: string): DesignReason[] {
  const subject = HERO_SUBJECT[a.hero] ?? "写真";
  const flow = LAYOUT_FLOW[a.layout] ?? "上から下へ";

  const reasons: DesignReason[] = [
    {
      title: "全部を同じ強さで見せていない",
      body: `一番見せたい${subject}は強く。次に見せたい見出しは少し弱く。それ以外はもっと弱く。今回は「${flow}」くらいの優先順位をつけています。要素全部に「見て！」と言わせないのが肝心で、そうすると情報が多くても「どこを見ればいいの？」と迷子になりません。`,
    },
    {
      title: "「何を置くか」より「どのくらい強く見せるか」",
      body:
        a.density === "heavy"
          ? "文章が多いページほど、強弱がないと読まれません。見出し・本文・注釈の3段階をはっきり分けて、読む順番を先に決めています。"
          : "載せる要素を減らすより、強さの差をつけるほうが効きます。同じ内容でも、大きさ・太さ・色の差で伝わり方が変わります。",
    },
    {
      title: "減らすのは要素の数ではなく「まとまり」の数",
      body:
        (a.density === "heavy"
          ? "しっかり読ませるページなので、載っている要素は多いままです。"
          : "写真・見出し・説明・ボタンと、要素そのものは決して少なくありません。") +
        "それでもごちゃごちゃして見えないのは、目がぱっと認識する「かたまり」を4〜5個に抑えているからです。写真と見出しは重ねて1つに、ボタンとリンクは並べて1つに。情報量を減らす前に、目が追うまとまりの数を減らすのが先です。",
    },
    {
      title: "グリッドは「揃える所」と「外す所」を決めるために使う",
      body: "見出し・本文・ボタンの左端は同じ線に揃えています。ただし全部きっちり収めると、きれいだけど退屈になります。だから主役の写真や大きな文字は、あえて線をまたがせています。揃っている所があるから、外した所が目立ちます。",
    },
    {
      title: "文字と写真を重ねて、前後を作っている",
      body: "見出しの一部が写真の後ろに隠れています。脳は「隠れている＝奥にある」と判断するので、その瞬間その文字は貼り付けた飾りではなく、そこに実在する物になります。大事なのは重ねること自体ではなく、手前と奥を行き来させること。全部手前ならただの平面、全部奥ならただの背景です。",
    },
    {
      title: "余白が要素より多い",
      body: "詰め込むほど安っぽく見えます。間を大きく空けると、一つひとつが大事に見えます。「情報を足す」より「間を空ける」ほうが、見栄えへの効き目は大きいです。",
    },
    {
      title: `色を${paletteName}の3色に絞っている`,
      body: "背景・文字・差し色の3色でほぼ全部を組んでいます。目安は 70:25:5。差し色を5%に抑えるから、そこが「一番強い場所」になります。色数を増やすと、どの色も強くなくなります。",
    },
  ];

  reasons.push({
    title: "効果は全面ではなく一部にだけかけている",
    body: "質感・柄・強い色は、画面の一部にだけ入れています。全面にかけると必ずやりすぎになります。「少しだけ、片側だけ」が、こなれて見えるかどうかの分かれ目です。",
  });

  if (a.tone === "cinema" || a.palette === "mono") {
    reasons.push({
      title: "色を捨てて写真を主役にしている",
      body: "背景から色を抜くと、写真だけが色を持つので視線が集まります。良い写真が1枚あるなら、周りを黒か白に振り切るのがいちばん強い見せ方です。",
    });
  }
  if (a.hero === "person") {
    reasons.push({
      title: "顔が写っている",
      body: "人は無意識に顔を探します。作り手の顔が1枚あるだけで、同じ内容でも信用されやすくなります。個人でやっている事業ほど効きます。",
    });
  }

  return reasons;
}

/** そのまま AI に貼れる日本語の指示文。パターン名は英語のまま残す */
export function promptFor(a: Answers, siteName: string, toneLabel: string, paletteName: string): string {
  const patterns = patternsFor(a);
  const lines = patterns.map((p) => `- ${p.en}（${p.ja}）: ${p.desc}`);
  return [
    `${siteName || "私の店"}のホームページのトップページを作ってください。`,
    "",
    `# 全体の方向性`,
    `- 空気感: ${toneLabel}`,
    `- 配色: ${paletteName}`,
    "",
    "# 使ってほしい UI パターン",
    ...lines,
    "",
    "# 条件",
    "- スマートフォンを優先して設計してください（レスポンシブ対応）",
    "- 見出しと本文のダミーテキストは日本語で入れてください",
    "- 画像は差し替え前提のプレースホルダーで構いません",
  ].join("\n");
}
