import { describe, it, expect, vi } from "vitest";
import type { Monaco } from "@monaco-editor/react";
import {
  createRootKeyRegex,
  configureSearchLanguage,
} from "./searchQueryLanguage";
import {
  ALERT_TYPES,
  BOOLEANS,
  DISTRIBUTION_UPGRADE_STATUSES,
  HARDWARE_ATTRIBUTES,
  HARDWARE_ROOT_KEYS,
  LICENSE_TYPES,
  LOGICAL_OPERATORS,
} from "../constants";

// Each call returns a unique ID to prevent cross-test interference
// with the module-level registeredLanguages / registeredCompletionProviders Sets.
let langCounter = 0;
const nextLangId = () => `test-lang-${++langCounter}`;

interface CompletionItem {
  label: string;
  insertText: string;
  kind: number;
  detail: string;
}

type ProviderFn = (
  model: unknown,
  position: unknown,
) => { suggestions: CompletionItem[] };

/** Builds a minimal Monaco mock and exposes the captured completion provider. */
function createMonacoMock() {
  let capturedProvider: ProviderFn | null = null;

  const monaco = {
    languages: {
      register: vi.fn(),
      setMonarchTokensProvider: vi.fn(),
      registerCompletionItemProvider: vi.fn(
        (_langId: string, provider: { provideCompletionItems: ProviderFn }) => {
          capturedProvider = provider.provideCompletionItems;
        },
      ),
      CompletionItemKind: {
        Keyword: 1,
        EnumMember: 2,
        Operator: 3,
        Text: 4,
        Property: 5,
      },
    },
  } as unknown as Monaco;

  return {
    monaco,
    getProvider: () => capturedProvider,
  };
}

/**
 * One-stop helper: creates a fresh Monaco mock, configures the language once,
 * and returns the captured provider (always non-null after a fresh langId).
 */
function setupLanguage(
  terms: string[],
  config: {
    profileTypes: readonly string[];
    usgStatuses?: readonly string[];
    wslStatuses?: readonly string[];
  } = {
    profileTypes: ["usg", "wsl", "script"],
    usgStatuses: ["pass", "fail"],
    wslStatuses: ["compliant", "noncompliant"],
  },
) {
  const { monaco, getProvider } = createMonacoMock();
  const langId = nextLangId();
  configureSearchLanguage(monaco, langId, terms, {
    profileTypes: config.profileTypes,
    usgStatuses: config.usgStatuses ?? [],
    wslStatuses: config.wslStatuses ?? [],
  });
  const provider = getProvider();
  if (!provider) throw new Error("Completion provider was not registered");
  return { monaco, provider, langId };
}

/** Invokes a provider as if the cursor sits at the end of textBeforeCursor. */
function callProvider(provider: ProviderFn, textBeforeCursor: string) {
  const column = textBeforeCursor.length + 1;
  const model = {
    getWordUntilPosition: vi
      .fn()
      .mockReturnValue({ startColumn: 1, endColumn: column }),
    getLineContent: vi.fn().mockReturnValue(textBeforeCursor),
  };
  const position = { lineNumber: 1, column };
  return provider(model, position).suggestions;
}

describe("createRootKeyRegex", () => {
  it("matches a single term before a colon", () => {
    const regex = createRootKeyRegex("alert");
    expect("alert:value").toMatch(regex);
  });

  it("does not match a term that is not followed by a colon", () => {
    const regex = createRootKeyRegex("alert");
    expect("alertvalue").not.toMatch(regex);
    expect("alert ").not.toMatch(regex);
  });

  it("matches each of multiple alternated terms", () => {
    const regex = createRootKeyRegex("alert|hostname|id");
    expect("alert:x").toMatch(regex);
    expect("hostname:x").toMatch(regex);
    expect("id:x").toMatch(regex);
    expect("other:x").not.toMatch(regex);
  });

  it("escapes special regex characters so dots are matched literally", () => {
    const regex = createRootKeyRegex("cpu\\.vendor");
    expect("cpu.vendor:x").toMatch(regex);
    // Without escaping a raw dot would match "cpuXvendor"; with escaping it must not
    expect("cpuXvendor:x").not.toMatch(regex);
  });

  it("uses a word boundary so partial suffix matches don't trigger", () => {
    const regex = createRootKeyRegex("id");
    expect("id:1").toMatch(regex);
    expect("acid:1").not.toMatch(regex);
  });
});

describe("configureSearchLanguage - registration", () => {
  it("registers the language on the first call", () => {
    const { monaco } = createMonacoMock();
    const langId = nextLangId();
    configureSearchLanguage(monaco, langId, ["hostname"], {
      profileTypes: [],
      usgStatuses: [],
      wslStatuses: [],
    });
    expect(monaco.languages.register).toHaveBeenCalledWith({ id: langId });
  });

  it("does not re-register the language on subsequent calls with the same ID", () => {
    const { monaco } = createMonacoMock();
    const langId = nextLangId();
    const cfg = { profileTypes: [], usgStatuses: [], wslStatuses: [] };
    configureSearchLanguage(monaco, langId, ["hostname"], cfg);
    configureSearchLanguage(monaco, langId, ["hostname", "tag"], cfg);
    expect(monaco.languages.register).toHaveBeenCalledTimes(1);
  });

  it("calls setMonarchTokensProvider on every call to refresh the tokenizer", () => {
    const { monaco } = createMonacoMock();
    const langId = nextLangId();
    const cfg = { profileTypes: [], usgStatuses: [], wslStatuses: [] };
    configureSearchLanguage(monaco, langId, ["hostname"], cfg);
    configureSearchLanguage(monaco, langId, ["hostname", "tag"], cfg);
    expect(monaco.languages.setMonarchTokensProvider).toHaveBeenCalledTimes(2);
  });

  it("registers the completion provider only once per language ID", () => {
    const { monaco } = createMonacoMock();
    const langId = nextLangId();
    const cfg = { profileTypes: [], usgStatuses: [], wslStatuses: [] };
    configureSearchLanguage(monaco, langId, ["hostname"], cfg);
    configureSearchLanguage(monaco, langId, ["hostname", "tag"], cfg);
    expect(
      monaco.languages.registerCompletionItemProvider,
    ).toHaveBeenCalledTimes(1);
  });

  it("deduplicates and trims whitespace from terms before storing", () => {
    const { provider } = setupLanguage([
      " hostname ",
      "hostname",
      "tag",
      "tag",
    ]);
    const suggestions = callProvider(provider, "");
    const labels = suggestions
      .filter((s) => s.detail === "Search term")
      .map((s) => s.label);
    expect(labels.filter((l) => l === "hostname")).toHaveLength(1);
    expect(labels.filter((l) => l === "tag")).toHaveLength(1);
  });
});

describe("completion provider - key context (no colon in token)", () => {
  it("returns configured terms as Keyword suggestions", () => {
    const terms = ["hostname", "tag", "alert"];
    const { provider } = setupLanguage(terms, { profileTypes: [] });
    const suggestions = callProvider(provider, "");
    const termSuggestions = suggestions.filter(
      (s) => s.detail === "Search term",
    );
    expect(termSuggestions.map((s) => s.label)).toEqual(
      expect.arrayContaining(terms),
    );
    expect(termSuggestions[0]).toMatchObject({ kind: 1 });
  });

  it("uses 'term:' insertText for non-hardware terms", () => {
    const { provider } = setupLanguage(["hostname"], { profileTypes: [] });
    const suggestions = callProvider(provider, "");
    const hostname = suggestions.find((item) => item.label === "hostname");
    expect(hostname?.insertText).toBe("hostname:");
  });

  it("uses 'term.' insertText for hardware root keys", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "");
    for (const hwKey of HARDWARE_ROOT_KEYS) {
      const found = suggestions.find((item) => item.label === hwKey);
      expect(found?.insertText, `${hwKey} insertText`).toBe(`${hwKey}.`);
    }
  });

  it("includes all LOGICAL_OPERATORS as Operator suggestions", () => {
    const { provider } = setupLanguage([], { profileTypes: [] });
    const suggestions = callProvider(provider, "");
    const opSuggestions = suggestions.filter(
      (s) => s.detail === "Logical operator",
    );
    expect(opSuggestions.map((s) => s.label)).toEqual(
      expect.arrayContaining([...LOGICAL_OPERATORS]),
    );
    expect(opSuggestions[0]).toMatchObject({ kind: 3 });
  });

  it("returns no term suggestions when no terms are configured", () => {
    const { provider } = setupLanguage([], { profileTypes: [] });
    const suggestions = callProvider(provider, "");
    expect(suggestions.filter((s) => s.detail === "Search term")).toHaveLength(
      0,
    );
  });
});

describe("completion provider - hardware dot context", () => {
  it("returns Property attribute suggestions for cpu.", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "cpu.");
    expect(suggestions.map((s) => s.label)).toEqual([
      ...HARDWARE_ATTRIBUTES.cpu,
    ]);
    expect(suggestions[0]).toMatchObject({
      kind: 5,
      detail: "cpu attribute",
      insertText: "vendor:",
    });
  });

  it("returns correct attributes for network.", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "network.");
    expect(suggestions.map((s) => s.label)).toEqual([
      ...HARDWARE_ATTRIBUTES.network,
    ]);
  });

  it("returns correct attributes for every hardware root key", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    for (const hwKey of HARDWARE_ROOT_KEYS) {
      const suggestions = callProvider(provider, `${hwKey}.`);
      expect(suggestions.map((s) => s.label)).toEqual([
        ...HARDWARE_ATTRIBUTES[hwKey],
      ]);
    }
  });

  it("falls through to term/operator suggestions for an unknown dot-prefix", () => {
    const { provider } = setupLanguage(["hostname"], { profileTypes: [] });
    const suggestions = callProvider(provider, "unknown.");
    // No hardware match, falls back to regular key context suggestions
    expect(suggestions.some((s) => s.detail === "Logical operator")).toBe(true);
  });
});

describe("completion provider - value context (colon in token)", () => {
  it("returns ALERT_TYPES EnumMember suggestions for 'alert:'", () => {
    const { provider } = setupLanguage(["alert"], { profileTypes: [] });
    const suggestions = callProvider(provider, "alert:");
    expect(suggestions.map((s) => s.label)).toEqual([...ALERT_TYPES]);
    expect(suggestions[0]).toMatchObject({ detail: "Alert Type", kind: 2 });
  });

  it("returns LICENSE_TYPES suggestions for 'license-type:'", () => {
    const { provider } = setupLanguage(["license-type"], { profileTypes: [] });
    const suggestions = callProvider(provider, "license-type:");
    expect(suggestions.map((s) => s.label)).toEqual([...LICENSE_TYPES]);
    expect(suggestions[0]).toMatchObject({ detail: "License Type" });
  });

  it("returns [reboot, license] suggestions for 'needs:'", () => {
    const { provider } = setupLanguage(["needs"], { profileTypes: [] });
    const suggestions = callProvider(provider, "needs:");
    expect(suggestions.map((s) => s.label)).toEqual(["reboot", "license"]);
    expect(suggestions[0]).toMatchObject({ detail: "Requirement" });
  });

  it("returns BOOLEANS suggestions for 'has-pro-management:'", () => {
    const { provider } = setupLanguage(["has-pro-management"], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "has-pro-management:");
    expect(suggestions.map((s) => s.label)).toEqual([...BOOLEANS]);
    expect(suggestions[0]).toMatchObject({ detail: "Boolean" });
  });

  it("returns DISTRIBUTION_UPGRADE_STATUSES for 'release-upgrade:'", () => {
    const { provider } = setupLanguage(["release-upgrade"], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "release-upgrade:");
    expect(suggestions.map((s) => s.label)).toEqual([
      ...DISTRIBUTION_UPGRADE_STATUSES,
    ]);
    expect(suggestions[0]).toMatchObject({ detail: "Release Upgrade Status" });
  });

  it("returns empty suggestions for an unknown key after a colon", () => {
    const { provider } = setupLanguage([], { profileTypes: [] });
    const suggestions = callProvider(provider, "unknownkey:");
    expect(suggestions).toHaveLength(0);
  });

  it("returns empty suggestions for alert with extra colon segments", () => {
    const { provider } = setupLanguage(["alert"], { profileTypes: [] });
    const suggestions = callProvider(provider, "alert:type:extra:");
    expect(suggestions).toHaveLength(0);
  });
});

describe("completion provider - profile deep suggestions", () => {
  const config = {
    profileTypes: ["usg", "wsl", "script"],
    usgStatuses: ["pass", "fail"],
    wslStatuses: ["compliant", "noncompliant"],
  };

  it("returns profile types as EnumMember at depth 1 (profile:)", () => {
    const { provider } = setupLanguage(["profile"], config);
    const suggestions = callProvider(provider, "profile:");
    expect(suggestions.map((s) => s.label)).toEqual(config.profileTypes);
    expect(suggestions[0]).toMatchObject({ detail: "Profile Type", kind: 2 });
  });

  it("returns <profile_id> Text placeholder at depth 2 (profile:usg:)", () => {
    const { provider } = setupLanguage(["profile"], config);
    const suggestions = callProvider(provider, "profile:usg:");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      label: "<profile_id>",
      detail: "ID for usg",
      kind: 4,
    });
  });

  it("returns USG statuses at depth 3 for profile:usg:id:", () => {
    const { provider } = setupLanguage(["profile"], config);
    const suggestions = callProvider(provider, "profile:usg:1:");
    expect(suggestions.map((s) => s.label)).toEqual(config.usgStatuses);
    expect(suggestions[0]).toMatchObject({ detail: "Audit Result" });
  });

  it("returns WSL statuses at depth 3 for profile:wsl:id:", () => {
    const { provider } = setupLanguage(["profile"], config);
    const suggestions = callProvider(provider, "profile:wsl:1:");
    expect(suggestions.map((s) => s.label)).toEqual(config.wslStatuses);
    expect(suggestions[0]).toMatchObject({ detail: "Compliance Status" });
  });

  it("returns empty suggestions at depth 3 for non-usg/wsl profile types", () => {
    const { provider } = setupLanguage(["profile"], config);
    const suggestions = callProvider(provider, "profile:script:1:");
    expect(suggestions).toHaveLength(0);
  });

  it("returns empty suggestions at depth 3 when usgStatuses config is empty", () => {
    const { provider } = setupLanguage(["profile"], {
      profileTypes: ["usg"],
      usgStatuses: [],
      wslStatuses: [],
    });
    const suggestions = callProvider(provider, "profile:usg:1:");
    expect(suggestions).toHaveLength(0);
  });

  it("returns empty suggestions at depth 3 when wslStatuses config is empty", () => {
    const { provider } = setupLanguage(["profile"], {
      profileTypes: ["wsl"],
      usgStatuses: [],
      wslStatuses: [],
    });
    const suggestions = callProvider(provider, "profile:wsl:1:");
    expect(suggestions).toHaveLength(0);
  });
});

describe("completion provider - annotation suggestions", () => {
  it("returns <key> Text placeholder at depth 1 (annotation:)", () => {
    const { provider } = setupLanguage(["annotation"], { profileTypes: [] });
    const suggestions = callProvider(provider, "annotation:");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      label: "<key>",
      detail: "Annotation Key",
      kind: 4,
    });
  });

  it("returns <string> Text placeholder at depth 2 (annotation:mykey:)", () => {
    const { provider } = setupLanguage(["annotation"], { profileTypes: [] });
    const suggestions = callProvider(provider, "annotation:mykey:");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      label: "<string>",
      detail: "Value substring match",
    });
  });

  it("returns empty suggestions beyond depth 2 (annotation:key:value:)", () => {
    const { provider } = setupLanguage(["annotation"], { profileTypes: [] });
    const suggestions = callProvider(provider, "annotation:key:value:");
    expect(suggestions).toHaveLength(0);
  });
});

describe("completion provider - hardware value context", () => {
  it("returns <value> Text placeholder for cpu.vendor:", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    // "cpu.vendor:" rootKey "cpu.vendor" contains a dot, depth 1
    const suggestions = callProvider(provider, "cpu.vendor:");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      label: "<value>",
      detail: "Hardware property value",
      kind: 4,
    });
  });

  it("returns <value> placeholder for disk.size:", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    const suggestions = callProvider(provider, "disk.size:");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({ label: "<value>" });
  });

  it("returns <value> for every hardware root attribute when followed by colon", () => {
    const { provider } = setupLanguage([...HARDWARE_ROOT_KEYS], {
      profileTypes: [],
    });
    for (const hwKey of HARDWARE_ROOT_KEYS) {
      for (const attr of HARDWARE_ATTRIBUTES[hwKey]) {
        const suggestions = callProvider(provider, `${hwKey}.${attr}:`);
        expect(suggestions).toHaveLength(1);
        expect(suggestions[0]).toMatchObject({ label: "<value>" });
      }
    }
  });
});
