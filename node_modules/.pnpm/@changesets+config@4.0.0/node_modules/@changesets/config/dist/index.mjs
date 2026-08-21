import fs from "node:fs/promises";
import path from "node:path";
import { getPackages } from "@manypkg/get-packages";
import picomatch from "picomatch";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { shouldSkipPackage } from "@changesets/should-skip-package";
const DEFAULT_CONFIG = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/**
* Returns the global configuration.
*
* @param config The config to merge.
*
* @returns The configuration.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config$1) {
	if (!config$1 && true) return DEFAULT_CONFIG;
	return {
		lang: config$1?.lang ?? void 0,
		message: config$1?.message,
		abortEarly: config$1?.abortEarly ?? void 0,
		abortPipeEarly: config$1?.abortPipeEarly ?? void 0
	};
}
/**
* Stringifies an unknown input to a literal or type string.
*
* @param input The unknown input.
*
* @returns A literal or type string.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}
/**
* Adds an issue to the dataset.
*
* @param context The issue context.
* @param label The issue label.
* @param dataset The input dataset.
* @param config The configuration.
* @param other The optional props.
*
* @internal
*/
function _addIssue(context, label, dataset, config$1, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config$1.lang,
		abortEarly: config$1.abortEarly,
		abortPipeEarly: config$1.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message$1 = other?.message ?? context.message ?? (context.reference, issue.lang, void 0) ?? (isSchema ? (issue.lang, void 0) : null) ?? config$1.message ?? (issue.lang, void 0);
	if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}
const _standardCache = /* @__PURE__ */ new WeakMap();
/**
* Returns the Standard Schema properties.
*
* @param context The schema context.
*
* @returns The Standard Schema properties.
*/
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	let cached = _standardCache.get(context);
	if (!cached) {
		cached = {
			version: 1,
			vendor: "valibot",
			validate(value$1) {
				return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
			}
		};
		_standardCache.set(context, cached);
	}
	return cached;
}
/**
* Disallows inherited object properties and prevents object prototype
* pollution by disallowing certain keys.
*
* @param object The object to check.
* @param key The key to check.
*
* @returns Whether the key is allowed.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isValidObjectKey(object$1, key) {
	return Object.prototype.hasOwnProperty.call(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
/**
* Joins multiple `expects` values with the given separator.
*
* @param values The `expects` values.
* @param separator The separator.
*
* @returns The joined `expects` property.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values$1, separator) {
	const list = [...new Set(values$1)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}
/* @__NO_SIDE_EFFECTS__ */
function getDotPath(issue) {
	if (issue.path) {
		let key = "";
		for (const item of issue.path) if (typeof item.key === "string" || typeof item.key === "number") if (key) key += `.${item.key}`;
		else key += item.key;
		else return null;
		return key;
	}
	return null;
}
/**
* A Valibot error with useful information.
*/
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};
/**
* Creates a description metadata action.
*
* @param description_ The description text.
*
* @returns A description action.
*/
/* @__NO_SIDE_EFFECTS__ */
function description(description_) {
	return {
		kind: "metadata",
		type: "description",
		reference: description,
		description: description_
	};
}
/**
* Creates an examples metadata action.
*
* @param examples_ The examples.
*
* @returns An examples action.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function examples(examples_) {
	return {
		kind: "metadata",
		type: "examples",
		reference: examples,
		examples: examples_
	};
}
/* @__NO_SIDE_EFFECTS__ */
function minLength(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_length",
		reference: minLength,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length < this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}
/**
* Returns the fallback value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The output dataset if available.
* @param config The config if available.
*
* @returns The fallback value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config$1) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
/**
* Returns the default value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The input dataset if available.
* @param config The config if available.
*
* @returns The default value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config$1) {
	return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
/* @__NO_SIDE_EFFECTS__ */
function array(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: array,
		expects: "Array",
		async: false,
		item,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function boolean(message$1) {
	return {
		kind: "schema",
		type: "boolean",
		reference: boolean,
		expects: "boolean",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "boolean") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function literal(literal_, message$1) {
	return {
		kind: "schema",
		type: "literal",
		reference: literal,
		expects: /* @__PURE__ */ _stringify(literal_),
		async: false,
		literal: literal_,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === this.literal) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullable(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullable",
		reference: nullable,
		expects: `(${wrapped.expects} | null)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function object(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: object,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function record(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "record",
		reference: record,
		expects: "Object",
		async: false,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
					const entryValue = input[entryKey];
					const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function tuple(items, message$1) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Returns the sub issues of the provided datasets for the union issue.
*
* @param datasets The datasets.
*
* @returns The sub issues.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _subIssues(datasets) {
	let issues;
	if (datasets) for (const dataset of datasets) if (issues) for (const issue of dataset.issues) issues.push(issue);
	else issues = dataset.issues;
	return issues;
}
/* @__NO_SIDE_EFFECTS__ */
function union(options, message$1) {
	return {
		kind: "schema",
		type: "union",
		reference: union,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}
/**
* Creates a unknown schema.
*
* @returns A unknown schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function unknown() {
	return {
		kind: "schema",
		type: "unknown",
		reference: unknown,
		expects: "unknown",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
function parse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parse result.
*/
/* @__NO_SIDE_EFFECTS__ */
function safeParse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	return {
		typed: dataset.typed,
		success: !dataset.issues,
		output: dataset.value,
		issues: dataset.issues
	};
}
//#endregion
//#region src/utils.ts
function globMatch(paths, patterns) {
	if (!patterns) return paths;
	const matchers = patterns.map((p) => picomatch(p, void 0, true));
	return paths.filter((path) => {
		if (path.includes("\\")) path = path.replace(/\\/g, "/");
		let passed = false;
		for (const matcher of matchers) if (!passed) {
			if (!matcher.state.negated && matcher(path)) passed = true;
		} else if (matcher.state.negated && !matcher(path)) passed = false;
		return passed;
	});
}
//#endregion
//#region src/config.ts
const rootKey = (schema, description$1, defaultValue) => /* @__PURE__ */ optional(description$1 != null ? /* @__PURE__ */ pipe(schema, /* @__PURE__ */ description(description$1)) : schema, defaultValue);
const PackageGroupSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ array(/* @__PURE__ */ array(/* @__PURE__ */ string())), /* @__PURE__ */ examples([[["@pkg/a", "@pkg/b"], ["@pkg/d", "@pkg/e"]]]));
const ChangelogSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ literal(false),
	/* @__PURE__ */ string(),
	/* @__PURE__ */ tuple([/* @__PURE__ */ string(), /* @__PURE__ */ nullable(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ unknown()))])
], "Invalid type: Expected false, a module path (\"@changesets/cli/changelog\" or \"./some-module\"), or a tuple of module path and options ([\"@changesets/cli/changelog\", { \"someOption\": true }]).");
const CommitSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ boolean(),
	/* @__PURE__ */ string(),
	/* @__PURE__ */ tuple([/* @__PURE__ */ string(), /* @__PURE__ */ nullable(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ unknown()))])
], "Invalid type: Expected a boolean, a module path (e.g. \"@changesets/cli/commit\" or \"./some-module\"), or a tuple with a module path and options (e.g. [\"@changesets/cli/commit\", { \"skipCI\": \"version\" }])]");
const AccessSchema = /* @__PURE__ */ union([/* @__PURE__ */ literal("public"), /* @__PURE__ */ literal("restricted")]);
const WrittenConfigSchema = /* @__PURE__ */ object({
	baseBranch: rootKey(/* @__PURE__ */ string(), "Determines the branch that Changesets uses when finding what packages have changed.", "main"),
	access: rootKey(AccessSchema, "Determines whether Changesets should publish packages to the registry publicly or to a restricted scope.", "restricted"),
	changedFilePatterns: rootKey(/* @__PURE__ */ array(/* @__PURE__ */ string()), "A list of file patterns that Changesets should consider when determining what packages have changed.", ["**"]),
	format: rootKey(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("auto"),
		/* @__PURE__ */ literal("prettier"),
		/* @__PURE__ */ literal("oxfmt"),
		/* @__PURE__ */ literal("deno"),
		/* @__PURE__ */ literal("dprint"),
		/* @__PURE__ */ literal(false)
	]), "The formatter to use to format changesets and changelogs. Set `false` to disable formatting. The default value of `auto` will auto-detect the formatter based on the project's configuration files.", "auto"),
	ignore: rootKey(/* @__PURE__ */ array(/* @__PURE__ */ string()), "Packages that should not be released.", []),
	fixed: rootKey(PackageGroupSchema, "Packages that should always be released together with the same version.", []),
	linked: rootKey(PackageGroupSchema, "Packages that should be linked together so when they are being released, they will be released at the same version.", []),
	updateInternalDependencies: rootKey(/* @__PURE__ */ union([/* @__PURE__ */ literal("minor"), /* @__PURE__ */ literal("patch")]), "The minimum bump type to trigger automatic update of internal dependencies that are part of the same release.", "patch"),
	privatePackages: rootKey(/* @__PURE__ */ union([/* @__PURE__ */ object({
		version: /* @__PURE__ */ optional(/* @__PURE__ */ boolean(), false),
		tag: /* @__PURE__ */ optional(/* @__PURE__ */ boolean(), false)
	}), /* @__PURE__ */ boolean()]), "Opt in to tracking non-npm / private packages", {}),
	bumpVersionsWithWorkspaceProtocolOnly: rootKey(/* @__PURE__ */ boolean(), "Determines whether Changesets should only bump dependency ranges that use workspace protocol of packages that are part of the workspace.", false),
	snapshot: rootKey(/* @__PURE__ */ object({
		useCalculatedVersion: /* @__PURE__ */ optional(/* @__PURE__ */ pipe(/* @__PURE__ */ boolean(), /* @__PURE__ */ description("Makes generated snapshot versions use the calculated version (based on the changeset files) as a base version, instead of 0.0.0")), false),
		prereleaseTemplate: /* @__PURE__ */ optional(/* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ minLength(1), /* @__PURE__ */ description("A template for the prerelease (suffix) part of the generated snapshot version. The template can use the following variable patterns: {commit}, {tag}, {datetime}, {timestamp}.")))
	}), "Snapshot-specific options.", {}),
	changelog: rootKey(ChangelogSchema, "The configuration for changelog generators.", "@changesets/cli/changelog"),
	commit: rootKey(CommitSchema, "Determines whether Changesets should commit the results of the add and version command.", false),
	___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: rootKey(/* @__PURE__ */ object({
		onlyUpdatePeerDependentsWhenOutOfRange: /* @__PURE__ */ optional(/* @__PURE__ */ boolean(), false),
		updateInternalDependents: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("always"), /* @__PURE__ */ literal("out-of-range")]), "out-of-range")
	}), "Unsafe options", {})
});
/**
* "Normalizes" a `WrittenConfig` into a `Config`, by filling in defaults and
* rewriting properties with multiple forms into a single one.
*/
function normalizeWrittenConfig({ packageNames, writtenConfig }) {
	const config = structuredClone(writtenConfig);
	if (typeof writtenConfig.changelog === "string") config.changelog = [writtenConfig.changelog, null];
	if (typeof writtenConfig.commit === "string") config.commit = [writtenConfig.commit, null];
	else if (writtenConfig.commit === true) config.commit = ["@changesets/cli/commit", { skipCI: "version" }];
	if (writtenConfig.ignore != null) config.ignore = globMatch(packageNames, writtenConfig.ignore);
	if (writtenConfig.fixed != null) config.fixed = writtenConfig.fixed.map((item) => globMatch(packageNames, item));
	if (writtenConfig.linked != null) config.linked = writtenConfig.linked.map((item) => globMatch(packageNames, item));
	if (typeof writtenConfig.privatePackages !== "object") config.privatePackages = {
		version: writtenConfig.privatePackages ?? false,
		tag: writtenConfig.privatePackages ?? false
	};
	else config.privatePackages = {
		version: writtenConfig.privatePackages.version ?? false,
		tag: writtenConfig.privatePackages.tag ?? false
	};
	return config;
}
//#endregion
//#region src/rules.ts
function getUnmatchedPatterns(listOfPackageNamesOrGlob, pkgNames) {
	return listOfPackageNamesOrGlob.filter((pkgOrGlob) => {
		const matcher = picomatch(pkgOrGlob);
		return !pkgNames.some((pkgName) => matcher(pkgName));
	});
}
const picomatchNote = `Note that glob expressions must be defined according to https://npmx.dev/picomatch.`;
const invalidPathOrGlobMessage = (pkgOrGlob) => `Invalid path: The package or glob "${pkgOrGlob}" does not match any package in the project. ${picomatchNote}`;
const fixedGroupsExist = ({ config, writtenConfig, packageNames, warnings }) => {
	if (config.fixed.length === 0) return;
	for (const fixedGroup of writtenConfig.fixed ?? []) warnings.push(...getUnmatchedPatterns(fixedGroup, packageNames).map((pkgOrGlob) => `fixed: ${invalidPathOrGlobMessage(pkgOrGlob)}`));
};
const noDuplicateFixedPackages = ({ config, errors }) => {
	if (config.fixed.length === 0) return;
	const foundNames = /* @__PURE__ */ new Set();
	const duplicatedNames = /* @__PURE__ */ new Set();
	for (const fixedGroup of config.fixed) {
		for (const name of fixedGroup) {
			if (foundNames.has(name)) duplicatedNames.add(name);
			foundNames.add(name);
		}
		errors.push(...Array.from(duplicatedNames, (pkgOrGlob) => `fixed: Invalid group: The package or glob "${pkgOrGlob}" is defined in multiple groups of fixed packages. Packages can only be belong to a single group. ${picomatchNote}`));
	}
};
const linkedGroupsExist = ({ config, writtenConfig, packageNames, warnings }) => {
	if (config.linked.length === 0) return;
	for (const linkedGroup of writtenConfig.linked ?? []) warnings.push(...getUnmatchedPatterns(linkedGroup, packageNames).map((pkgOrGlob) => `linked: ${invalidPathOrGlobMessage(pkgOrGlob)}`));
};
const noDuplicateLinkedPackages = ({ config, errors }) => {
	if (config.linked.length === 0) return;
	const foundNames = /* @__PURE__ */ new Set();
	const duplicatedNames = /* @__PURE__ */ new Set();
	for (const linkedGroup of config.linked) {
		for (const name of linkedGroup) {
			if (foundNames.has(name)) duplicatedNames.add(name);
			foundNames.add(name);
		}
		errors.push(...Array.from(duplicatedNames, (pkgOrGlob) => `linked: Invalid group: The package or glob "${pkgOrGlob}" is defined in multiple groups of linked packages. Packages can only be belong to a single group. ${picomatchNote}`));
	}
};
const noFixedAndLinkedPackages = ({ config, errors }) => {
	if (config.fixed.length === 0 || config.linked.length === 0) return;
	const allFixedPackages = new Set(config.fixed.flat());
	const allLinkedPackages = new Set(config.linked.flat());
	for (const fixedName of allFixedPackages) if (allLinkedPackages.has(fixedName)) errors.push(`Invalid group: The package "${fixedName}" can be found in both fixed and linked groups. A package can only be either fixed or linked.`);
};
const alsoSkipDependentsOfSkipped = ({ packages, config, errors }) => {
	if (config.ignore.length === 0 && config.privatePackages.version) return;
	const dependentsGraph = getDependentsGraph(packages, {
		ignoreDevDependencies: true,
		bumpVersionsWithWorkspaceProtocolOnly: config.bumpVersionsWithWorkspaceProtocolOnly
	});
	const packagesByName = new Map(packages.packages.map((pkg) => [pkg.packageJson.name, pkg]));
	for (const pkg of packages.packages) {
		if (!shouldSkipPackage(pkg, {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) continue;
		const skippedPackage = pkg.packageJson.name;
		const dependents = dependentsGraph.get(skippedPackage) || [];
		for (const dependent of dependents) {
			const dependentPkg = packagesByName.get(dependent);
			if (!dependentPkg) continue;
			if (shouldSkipPackage(dependentPkg, {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.version
			})) continue;
			if (dependentPkg.packageJson.private) continue;
			errors.push(`Invalid tree: "${dependent}" depends on the skipped package "${skippedPackage}", but "${dependent}" is not skipped. Please add "${dependent}" to the "ignore" option.`);
		}
	}
};
const noPrivateTagWithoutPrivateVersion = ({ config, errors }) => {
	const { version, tag } = config.privatePackages;
	if (version === false && tag === true) errors.push(`privatePackages: Invalid combination: "tag" is set to "true" but "version" is set to "false".`);
};
const rules = [
	fixedGroupsExist,
	noDuplicateFixedPackages,
	linkedGroupsExist,
	noDuplicateLinkedPackages,
	noFixedAndLinkedPackages,
	alsoSkipDependentsOfSkipped,
	noPrivateTagWithoutPrivateVersion
];
function validateConfigByRules(ctx) {
	const fullCtx = {
		...ctx,
		errors: [],
		warnings: []
	};
	for (const rule of rules) rule(fullCtx);
	return {
		errors: fullCtx.errors,
		warnings: fullCtx.warnings
	};
}
//#endregion
//#region src/parse.ts
function flattenIssues(issues) {
	return issues.map((issue) => `${/* @__PURE__ */ getDotPath(issue)}: ${issue.message}`);
}
function validateConfig(json, packages) {
	const writtenConfigResult = /* @__PURE__ */ safeParse(WrittenConfigSchema, json);
	if (!writtenConfigResult.success) return {
		config: void 0,
		warnings: [],
		errors: flattenIssues(writtenConfigResult.issues)
	};
	const writtenConfig = writtenConfigResult.output;
	const packageNames = packages.packages.map((pkg) => pkg.packageJson.name);
	const config = normalizeWrittenConfig({
		packageNames,
		writtenConfig
	});
	const { errors, warnings } = validateConfigByRules({
		packages,
		packageNames,
		config,
		writtenConfig
	});
	if (errors.length !== 0) return {
		config: void 0,
		warnings,
		errors
	};
	return {
		config,
		warnings,
		errors: void 0
	};
}
async function readConfig(cwd, packages) {
	cwd ??= process.cwd();
	packages ??= await getPackages(cwd);
	return validateConfig(JSON.parse(await fs.readFile(path.join(packages.rootDir, ".changeset", "config.json"), "utf8")), packages);
}
//#endregion
//#region package.json
var version = "4.0.0";
//#endregion
//#region src/defaults.ts
const defaultWrittenConfig = {
	["$schema"]: `https://unpkg.com/@changesets/config@${version}/schema.json`,
	baseBranch: "main",
	access: "restricted",
	ignore: [],
	fixed: [],
	linked: [],
	format: "auto",
	updateInternalDependencies: "patch",
	commit: false,
	changelog: "@changesets/cli/changelog"
};
const defaultConfig = normalizeWrittenConfig({
	packageNames: [],
	writtenConfig: parse(WrittenConfigSchema, defaultWrittenConfig)
});
//#endregion
export { defaultConfig, defaultWrittenConfig, readConfig, validateConfig };
