import { t as src_default } from "./src.mjs";
import { n as splitByTagStatus, t as buildGitTag } from "./gitTags.mjs";
import path from "node:path";
import * as git from "@changesets/git";
import fs from "node:fs/promises";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
//#region src/utils/output.ts
async function createOutputReport(outputPath) {
	if (!outputPath) return;
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	const stream = createWriteStream(outputPath, { flags: "a" });
	return {
		write(event) {
			stream.write(`${JSON.stringify(event)}\n`);
		},
		async [Symbol.asyncDispose]() {
			stream.end();
			await once(stream, "finish");
		}
	};
}
//#endregion
//#region src/commands/git-tag/utils.ts
async function createGitTags(opts) {
	const { untagged, existing } = await splitByTagStatus(opts.packages.rootDir, opts.packages.tool, opts.releases);
	const newTags = [];
	for (const entry of untagged) {
		const tagName = buildGitTag(opts.packages.tool, entry);
		await git.tag(tagName, opts.packages.rootDir);
		opts.reporter?.write({
			type: "git-tag",
			tag: tagName,
			packageName: entry.name
		});
		newTags.push(entry);
	}
	return {
		tagged: newTags,
		existing
	};
}
function buildTagMessage(tool, pkg) {
	return tool.type !== "root" ? `${src_default.blue(pkg.name)}@${src_default.green(pkg.version)}` : src_default.cyan(`v${pkg.version}`);
}
function formatGitTagResults(tool, results) {
	if (results.tagged.length === 0 && results.existing.length === 0) return "Created git tags.";
	const lines = [];
	if (results.tagged.length !== 0) lines.push("Created git tags:", ...results.tagged.map((entry) => `- ${buildTagMessage(tool, entry)}`));
	if (results.existing.length !== 0) lines.push("Skipped tags (already exist):", ...results.existing.map((entry) => `- ${buildTagMessage(tool, entry)}`));
	return lines.join("\n");
}
//#endregion
//#region \0@oxc-project+runtime@0.140.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
export { createOutputReport as i, createGitTags as n, formatGitTagResults as r, _usingCtx as t };
