export type PhotoDto = {
  id: string;
  url: string;
  thumb: string;
  author: string;
  authorUrl: string;
  downloadLocation: string;
  /** gemini = scripts/gen-photos.mjs で事前生成し public/generated/ に置いた画像 */
  source: "unsplash" | "pexels" | "pixabay" | "openverse" | "gemini";
  license?: string;
  licenseUrl?: string;
};
