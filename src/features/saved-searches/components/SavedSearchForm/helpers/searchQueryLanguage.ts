import type { Monaco } from "@monaco-editor/react";
import {
  ALERT_TYPES,
  LICENSE_TYPES,
  BOOLEANS,
  LOGICAL_OPERATORS,
  LAST_TOKEN_REGEX,
  WHITESPACE_TOKEN_REGEX,
  LOGICAL_OPERATOR_HIGHLIGHT_REGEX,
  NUMBER_BEFORE_COLON_REGEX,
  KEY_BEFORE_COLON_REGEX,
  QUOTED_STRING_REGEX,
  NUMBER_REGEX,
  COLON_REGEX,
} from "../constants";
import type { MonacoRange } from "../types";

interface LanguageConfig {
  profileTypes: readonly string[];
  usgStatuses: readonly string[];
  wslStatuses: readonly string[];
}

interface LanguageData {
  terms: string[];
  config: LanguageConfig;
}

const registeredLanguages = new Set<string>();
const registeredCompletionProviders = new Set<string>();
const languageTerms: Record<string, LanguageData> = {};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createRootKeyRegex = (termPattern: string) =>
  new RegExp(`\\b(${termPattern})(?=:)`);

const getProfileSuggestions = (
  segments: string[],
  depth: number,
  range: MonacoRange,
  monaco: Monaco,
  config: LanguageConfig,
) => {
  const createItem = (label: string, detail: string, isKeyword = false) => ({
    label,
    kind: isKeyword
      ? monaco.languages.CompletionItemKind.Keyword
      : monaco.languages.CompletionItemKind.EnumMember,
    insertText: label,
    range,
    detail,
  });

  const createPlaceholder = (label: string, detail: string) => ({
    label: `<${label}>`,
    kind: monaco.languages.CompletionItemKind.Text,
    insertText: `<${label}>`,
    range,
    detail,
  });

  if (depth === 1) {
    return config.profileTypes.map((t) => createItem(t, "Profile Type"));
  }

  const profileTypeIndex = 1;
  const profileType = segments[profileTypeIndex];

  if (depth === 2) {
    return [createPlaceholder("profile_id", `ID for ${profileType}`)];
  }

  if (depth === 3) {
    if (profileType === "security" && config.usgStatuses.length > 0) {
      return config.usgStatuses.map((s) => createItem(s, "Audit Result"));
    }
    if (profileType === "wsl" && config.wslStatuses.length > 0) {
      return config.wslStatuses.map((s) => createItem(s, "Compliance Status"));
    }
  }

  return [];
};

const getAnnotationSuggestions = (
  depth: number,
  range: MonacoRange,
  monaco: Monaco,
) => {
  const createPlaceholder = (label: string, detail: string) => ({
    label: `<${label}>`,
    kind: monaco.languages.CompletionItemKind.Text,
    insertText: `<${label}>`,
    range,
    detail,
  });

  if (depth === 1) {
    return [createPlaceholder("key", "Annotation Key")];
  }
  if (depth === 2) {
    return [createPlaceholder("string", "Value substring match")];
  }
  return [];
};

const getSimpleEnumSuggestions = <T extends string>(
  values: readonly T[],
  detail: string,
  range: MonacoRange,
  monaco: Monaco,
) => {
  return values.map((v) => ({
    label: v,
    kind: monaco.languages.CompletionItemKind.EnumMember,
    insertText: v,
    range,
    detail,
  }));
};

const getDeepSuggestions = (
  segments: string[],
  range: MonacoRange,
  monaco: Monaco,
  config: LanguageConfig,
) => {
  const [rootKey] = segments;
  const depth = segments.length - 1;

  switch (rootKey) {
    case "profile":
      return getProfileSuggestions(segments, depth, range, monaco, config);

    case "alert":
      if (depth === 1) {
        return getSimpleEnumSuggestions(
          ALERT_TYPES,
          "Alert Type",
          range,
          monaco,
        );
      }
      return [];

    case "license-type":
      if (depth === 1) {
        return getSimpleEnumSuggestions(
          LICENSE_TYPES,
          "License Type",
          range,
          monaco,
        );
      }
      return [];

    case "needs":
      if (depth === 1) {
        return getSimpleEnumSuggestions(
          ["reboot", "license"],
          "Requirement",
          range,
          monaco,
        );
      }
      return [];

    case "has-pro-management":
      if (depth === 1) {
        return getSimpleEnumSuggestions(BOOLEANS, "Boolean", range, monaco);
      }
      return [];

    case "annotation":
      return getAnnotationSuggestions(depth, range, monaco);

    default:
      return [];
  }
};

export const configureSearchLanguage = (
  monaco: Monaco,
  languageId: string,
  terms: string[],
  config: LanguageConfig,
) => {
  const cleanedTerms = terms.map((t) => t.trim()).filter(Boolean);
  const uniqueTerms = Array.from(new Set(cleanedTerms));
  languageTerms[languageId] = { terms: uniqueTerms, config };

  const termPattern =
    uniqueTerms.length > 0
      ? uniqueTerms.map(escapeRegExp).join("|")
      : "NEVER_MATCH";

  if (!registeredLanguages.has(languageId)) {
    monaco.languages.register({ id: languageId });
    registeredLanguages.add(languageId);
  }

  monaco.languages.setMonarchTokensProvider(languageId, {
    tokenizer: {
      root: [
        [WHITESPACE_TOKEN_REGEX, "white"],
        [LOGICAL_OPERATOR_HIGHLIGHT_REGEX, "keyword"],
        [createRootKeyRegex(termPattern), "type.identifier"],
        [NUMBER_BEFORE_COLON_REGEX, "number"],
        [KEY_BEFORE_COLON_REGEX, "type.identifier"],
        [QUOTED_STRING_REGEX, "string"],
        [NUMBER_REGEX, "number"],
        [COLON_REGEX, "delimiter"],
      ],
    },
  });

  if (!registeredCompletionProviders.has(languageId)) {
    monaco.languages.registerCompletionItemProvider(languageId, {
      triggerCharacters: [":", " ", '"'],
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range: MonacoRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const lineContent = model.getLineContent(position.lineNumber);
        const cursorIndex = position.column - 1;
        const textBeforeCursor = lineContent.slice(0, cursorIndex);

        const match = textBeforeCursor.match(LAST_TOKEN_REGEX);
        const fullToken = match?.[1] ?? "";

        const segments = fullToken.split(":");
        const isValueContext = segments.length > 1;

        const languageData = languageTerms[languageId];
        const storedConfig = languageData?.config ?? {
          profileTypes: [],
          usgStatuses: [],
          wslStatuses: [],
        };

        if (isValueContext) {
          const suggestions = getDeepSuggestions(
            segments,
            range,
            monaco,
            storedConfig,
          );
          return { suggestions };
        }

        const currentTerms = languageData?.terms ?? [];

        const termSuggestions = currentTerms.map((term) => ({
          label: term,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `${term}:`,
          range,
          detail: "Search term",
        }));

        const operatorSuggestions = LOGICAL_OPERATORS.map((op) => ({
          label: op,
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: op,
          range,
          detail: "Logical operator",
        }));

        return {
          suggestions: [...termSuggestions, ...operatorSuggestions],
        };
      },
    });

    registeredCompletionProviders.add(languageId);
  }
};
