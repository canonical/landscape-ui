import path from "node:path";
import { styleText } from "node:util";
import Range from "semver/classes/range.js";
//#region ../color/src/index.ts
var src_default = new Proxy({}, { get(target, color) {
	target[color] ??= (text) => styleText(color, text);
	return target[color];
} });
//#endregion
//#region src/get-dependency-graph.ts
const DEPENDENCY_TYPES = [
	"dependencies",
	"devDependencies",
	"peerDependencies",
	"optionalDependencies"
];
const getAllDependencies = (config, ignoreDevDependencies) => {
	const allDependencies = /* @__PURE__ */ new Map();
	for (const type of DEPENDENCY_TYPES) {
		const deps = config[type];
		if (!deps) continue;
		for (const name of Object.keys(deps)) {
			const depRange = deps[name];
			if (type === "devDependencies" && (ignoreDevDependencies || depRange.startsWith("link:") || depRange.startsWith("file:"))) continue;
			allDependencies.set(name, depRange);
		}
	}
	return allDependencies;
};
const isProtocolRange = (range) => range.includes(":");
const getValidRange = (potentialRange) => {
	if (isProtocolRange(potentialRange)) return null;
	try {
		return new Range(potentialRange);
	} catch {
		return null;
	}
};
function getDependencyGraph(packages, rootPackage, { ignoreDevDependencies = false, bumpVersionsWithWorkspaceProtocolOnly = false } = {}) {
	const graph = /* @__PURE__ */ new Map();
	let valid = true;
	const packagesByName = { [rootPackage.packageJson.name]: rootPackage };
	const relativePathsByName = { [rootPackage.packageJson.name]: "." };
	const queue = [rootPackage];
	for (const pkg of packages.packages) {
		queue.push(pkg);
		packagesByName[pkg.packageJson.name] = pkg;
		relativePathsByName[pkg.packageJson.name] = path.relative(rootPackage.dir, pkg.dir).replace(/\\/g, "/");
	}
	for (const pkg of queue) {
		const { name } = pkg.packageJson;
		const dependencies = [];
		const allDependencies = getAllDependencies(pkg.packageJson, ignoreDevDependencies);
		for (let [depName, depRange] of allDependencies) {
			const match = packagesByName[depName];
			if (!match) continue;
			const expected = match.packageJson.version;
			const rawDepRange = depRange;
			if (depRange.startsWith("workspace:")) {
				depRange = depRange.replace(/^workspace:/, "");
				if (depRange === "*" || depRange === "^" || depRange === "~") {
					dependencies.push(depName);
					continue;
				}
				if (path.posix.normalize(depRange) === relativePathsByName[depName]) {
					dependencies.push(depName);
					continue;
				}
				if (!getValidRange(depRange)) {
					valid = false;
					console.error(`Package ${src_default.blue(name)} must depend on the current version of ${src_default.blue(depName)}: ${src_default.green(expected)} vs ${src_default.red(rawDepRange)}`);
					continue;
				}
			} else if (bumpVersionsWithWorkspaceProtocolOnly) continue;
			const range = getValidRange(depRange);
			if (range && !range.test(expected) || isProtocolRange(depRange)) {
				valid = false;
				console.error(`Package ${src_default.blue(name)} must depend on the current version of ${src_default.blue(depName)}: ${src_default.green(expected)} vs ${src_default.red(rawDepRange)}`);
				continue;
			}
			if (!range) continue;
			dependencies.push(depName);
		}
		graph.set(name, {
			pkg,
			dependencies
		});
	}
	return {
		graph,
		valid
	};
}
//#endregion
//#region src/index.ts
function getDependentsGraph(packages, opts) {
	const graph = /* @__PURE__ */ new Map();
	const rootPackage = packages.rootPackage;
	if (rootPackage == null) return /* @__PURE__ */ new Map();
	const { graph: dependencyGraph } = getDependencyGraph(packages, rootPackage, opts);
	const dependentsLookup = { [rootPackage.packageJson.name]: {
		pkg: rootPackage,
		dependents: []
	} };
	packages.packages.forEach((pkg) => {
		dependentsLookup[pkg.packageJson.name] = {
			pkg,
			dependents: []
		};
	});
	packages.packages.forEach((pkg) => {
		const dependent = pkg.packageJson.name;
		const valFromDependencyGraph = dependencyGraph.get(dependent);
		if (valFromDependencyGraph) valFromDependencyGraph.dependencies.forEach((dependency) => {
			dependentsLookup[dependency].dependents.push(dependent);
		});
	});
	Object.keys(dependentsLookup).forEach((key) => {
		graph.set(key, dependentsLookup[key]);
	});
	const simplifiedDependentsGraph = /* @__PURE__ */ new Map();
	graph.forEach((info, pkgName) => {
		simplifiedDependentsGraph.set(pkgName, info.dependents);
	});
	return simplifiedDependentsGraph;
}
//#endregion
export { getDependentsGraph };
