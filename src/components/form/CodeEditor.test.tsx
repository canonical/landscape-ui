import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CodeEditor from "./CodeEditor";

vi.mock("./CodeEditorInner", () => ({
  default: ({ label }: { label: string }) => (
    <div data-testid="code-editor-inner">{label}</div>
  ),
}));

describe("CodeEditor", () => {
  it("renders lazy inner editor", async () => {
    render(<CodeEditor label="Script" value="echo hello" />);

    expect(await screen.findByTestId("code-editor-inner")).toHaveTextContent(
      "Script",
    );
  });
});
