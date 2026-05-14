import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CodeEditorMock, { Editor } from "@/tests/monacoMock";

describe("monacoMock", () => {
  it("renders editor value and invokes optional callbacks", async () => {
    const user = userEvent.setup();
    const beforeMount = vi.fn();
    const onChange = vi.fn();

    render(
      <Editor
        value="echo hi"
        language="shell"
        theme="vs-dark"
        className="editor"
        beforeMount={beforeMount}
        onChange={onChange}
      />,
    );

    const editor = screen.getByTestId("mock-monaco");
    expect(editor).toHaveValue("echo hi");
    expect(editor).toHaveAttribute("data-language", "shell");
    expect(editor).toHaveAttribute("data-theme", "vs-dark");
    expect(editor).toHaveClass("editor");
    expect(beforeMount).toHaveBeenCalledWith({ mocked: true });

    await user.clear(editor);
    await user.type(editor, "updated value");

    expect(onChange).toHaveBeenCalled();
  });

  it("uses defaultValue when value is undefined", async () => {
    const user = userEvent.setup();

    render(<Editor defaultValue="fallback" />);

    const editor = screen.getByTestId("mock-monaco");
    expect(editor).toHaveValue("fallback");

    await user.type(editor, " text");
    expect(editor).toHaveValue("fallback");
  });

  it("renders CodeEditorMock content and conditionally renders errors", () => {
    const { rerender } = render(
      <CodeEditorMock
        label="Script"
        value="echo test"
        error="Invalid script"
        headerContent={<span>Header action</span>}
      />,
    );

    expect(screen.getByText("Script")).toBeInTheDocument();
    expect(screen.getByText("Header action")).toBeInTheDocument();
    expect(screen.getByText("Invalid script")).toBeInTheDocument();

    rerender(<CodeEditorMock label="Script" error={false} />);
    expect(screen.queryByText("Invalid script")).not.toBeInTheDocument();
  });
});
