export type PhotoDto = {
  id: string;
  url: string;
  thumb: string;
  author: string;
  authorUrl: string;
  downloadLocation: string;
  source: "unsplash" | "pexels" | "pixabay" | "openverse";
  license?: string;
  licenseUrl?: string;
};
