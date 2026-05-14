import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchQueryEditor from "./SearchQueryEditor";

const codeEditorSpy = vi.fn();

vi.mock("@/components/form/CodeEditor", () => ({
  default: (props: Record<string, unknown>) => {
    codeEditorSpy(props);
    return <div data-testid="search-query-editor-mock" />;
  },
}));

describe("SearchQueryEditor", () => {
  it("configures monaco language when terms exist", () => {
    const configureSearchLanguage = vi.fn();

    render(
      <SearchQueryEditor
        label="Search"
        value="status:installed"
        languageId="landscape-query"
        terms={["status"]}
        languageConfig={{
          profileTypes: ["usg"],
          usgStatuses: ["compliant"],
          wslStatuses: ["enabled"],
        }}
        configureSearchLanguage={configureSearchLanguage}
      />,
    );

    const call = codeEditorSpy.mock.calls.at(-1)?.[0] as {
      monacoBeforeMount: (monaco: unknown) => void;
      options: Record<string, unknown>;
      language: string;
    };

    expect(call.language).toBe("landscape-query");
    expect(call.options).toMatchObject({
      fixedOverflowWidgets: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    });

    const monaco = { editor: {} };
    call.monacoBeforeMount(monaco);

    expect(configureSearchLanguage).toHaveBeenCalledWith(
      monaco,
      "landscape-query",
      ["status"],
      {
        profileTypes: ["usg"],
        usgStatuses: ["compliant"],
        wslStatuses: ["enabled"],
      },
    );
  });

  it("does not configure monaco language when terms are empty", () => {
    const configureSearchLanguage = vi.fn();

    render(
      <SearchQueryEditor
        label="Search"
        value=""
        languageId="landscape-query"
        terms={[]}
        languageConfig={{
          profileTypes: [],
          usgStatuses: [],
          wslStatuses: [],
        }}
        configureSearchLanguage={configureSearchLanguage}
      />,
    );

    const call = codeEditorSpy.mock.calls.at(-1)?.[0] as {
      monacoBeforeMount: (monaco: unknown) => void;
    };

    call.monacoBeforeMount({});
    expect(configureSearchLanguage).not.toHaveBeenCalled();
  });
});
