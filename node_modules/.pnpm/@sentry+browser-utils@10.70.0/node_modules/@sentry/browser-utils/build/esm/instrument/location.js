import { WINDOW } from '../types.js';

function getAbsoluteUrl(urlOrPath) {
  try {
    const url = new URL(urlOrPath, WINDOW.location.origin);
    return url.toString();
  } catch {
    return urlOrPath;
  }
}

export { getAbsoluteUrl };
//# sourceMappingURL=location.js.map
