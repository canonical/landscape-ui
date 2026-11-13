import { styleText } from "node:util";
//#region ../color/src/index.ts
var src_default = new Proxy({}, { get(target, color) {
	target[color] ??= (text) => styleText(color, text);
	return target[color];
} });
//#endregion
export { src_default as t };
