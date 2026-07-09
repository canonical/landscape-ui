import { TRANSPARENT_GIF_DATA_URI } from "./constants";

// Builds the transparent image used as the native HTML5 drag image so the
// browser doesn't draw its own drag ghost. Returns null in non-DOM
// environments (e.g. SSR / unit tests without `Image`). Intended to be called
// once at module load and reused — the browser decodes the data URI eagerly.
export const createTransparentDragImage = (): HTMLImageElement | null => {
  if (typeof Image === "undefined") {
    return null;
  }

  const image = new Image();
  image.src = TRANSPARENT_GIF_DATA_URI;
  return image;
};
