Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const types = require('../types.js');

function getAbsoluteUrl(urlOrPath) {
  try {
    const url = new URL(urlOrPath, types.WINDOW.location.origin);
    return url.toString();
  } catch {
    return urlOrPath;
  }
}

exports.getAbsoluteUrl = getAbsoluteUrl;
//# sourceMappingURL=location.js.map
