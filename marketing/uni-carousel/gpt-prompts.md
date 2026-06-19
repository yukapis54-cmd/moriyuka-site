# GPT画像生成プロンプト集 ｜ 瀬戸内 塩水・無添加ムラサキウニ

GPT（ChatGPTの画像生成 / gpt-image）に投げて、カルーセル用の**写真素材**を作るためのプロンプト集です。

## 使い方（推奨ワークフロー）
1. 下の「① 共通スタイル」を会話の最初に貼って世界観を固定
2. 「② スライド別プロンプト」を1枚ずつ投げて生成（**文字は入れさせない**＝日本語が崩れるため）
3. 出てきた画像を `photo/01.jpg`〜`07.jpg` に保存（04は比較表なので不要）
4. `node render-natural.js` を実行 → テンプレの枠に写真が自動で流し込まれます
5. テキスト・見出しはテンプレ側で入るので、写真は“素材”として綺麗に撮れていればOK

> 💡 比率：各スロットに合わせるなら 4:5（縦）か 1:1（正方形）で出して、`render-natural.js` 側が `cover` で良い位置に収めます。迷ったら **1:1 か 4:5** で生成してください。

---

## ① 共通スタイル（最初に1回貼る）

```
You are generating photography for a premium Japanese mail-order seafood brand
called "MORIYUKA", based on a small island in the Seto Inland Sea (Setouchi),
Ehime, Japan. The product is fresh, additive-free SALT-WATER sea urchin
(murasaki-uni / purple sea urchin roe): glossy orange-gold lobes kept in clear
seawater, NO alum (myoban), no wooden pressed "ita-uni".

Visual style for every image:
- Natural soft window light, gentle shadows, calm and airy mood
- Warm cream / beige / oatmeal color palette, slightly desaturated film-like grade
- Minimal, refined styling: pale linen, light wood, ceramic, sea elements
- Shallow depth of field, 85mm look, high detail, appetizing and fresh
- Lots of negative/empty space, editorial e-commerce quality
- ABSOLUTELY NO text, no letters, no logos, no watermark, no UI

Avoid: cartoon, 3D render, plastic look, oversaturation, harsh flash,
deformed hands, messy background, fake-looking food.
```

---

## ② スライド別プロンプト

### 01｜表紙（主役カット）
```
Hero product shot: a small clear glass jar / clear container of fresh
salt-water sea urchin — vivid glossy orange-gold uni lobes floating in clear
seawater — placed on a pale linen cloth beside a window. Soft morning light,
cream background, slight 45-degree angle, fresh and premium. Generous empty
space around the jar. Square 1:1 or 4:5. No text.
```

### 02｜問題提起（添加物の“板ウニ”を表現）
```
Contrast shot representing ordinary "ita-uni": sea urchin roe arranged in neat
tight rows on a dark cedar wooden tray, flatter and more clinical lighting,
slightly muted and cool tone to feel less appetizing than fresh uni. Top-down,
dark wood background. Landscape framing. No text.
```

### 03｜無添加の良さ（マクロ）
```
Extreme close-up macro of glistening fresh orange sea urchin lobes, dewy and
plump, showing delicate texture and natural sheen, soft directional light,
very shallow depth of field, mouth-watering. Warm cream backdrop blurred.
Wide / landscape crop. No text.
```

### 05｜なぜ瀬戸内（風景）
```
Serene Seto Inland Sea (Setouchi) seascape at golden hour: calm glassy water,
layers of small green island silhouettes in soft haze, gentle warm sky, deeply
tranquil, no people, no boats in foreground. Cinematic, peaceful. Wide
landscape. No text.
```

### 06｜鮮度・産地直送（漁・パック）
```
Authentic documentary-style but warm: a fisherman's weathered hands gently
placing freshly caught sea urchin roe into a clear container of seawater on a
small boat at early morning, sea in soft background, natural light, honest and
fresh, premium. Wide framing. No text.
```

### 07｜通販・ギフト
```
Elegant minimal gift presentation: two small clear jars of salt-water uni next
to a simply wrapped paper gift box tied with thin natural twine, on a cream
linen surface, soft light, premium Japanese mail-order gift aesthetic, lots of
calm empty space. Slightly vertical 4:5. No text.
```

---

## ③ もしGPTだけで“完成版スライド”まで作りたい場合
日本語の文字が崩れやすい前提で、1枚ずつ作るならこの型：

```
Create a 1080x1350 (4:5 vertical) Instagram carousel slide for a premium
Japanese seafood brand. Top 60%: [上の各スライド写真プロンプトをここに].
Bottom 40%: a clean cream panel with elegant minimal Japanese serif (mincho)
typography. Headline: 「__ここに見出し__」. Sub: 「__小さい説明__」.
Thin hairline rule, small uppercase latin label, page number "0X / 07".
Calm, airy, lots of whitespace. Brand mark "MORIYUKA" small at bottom.
```

> ⚠ ただし画像生成は日本語が高確率で崩れます。**文字はテンプレ（render-natural.js）側で入れる**のが確実できれいです。
> 見出し・説明文・キャプションは `caption.md` を参照してください。
