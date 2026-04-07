import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CodeEditorInner from "./CodeEditorInner";

const useThemeSpy = vi.fn();

vi.mock("@/context/theme", () => ({
  useTheme: () => useThemeSpy(),
}));

vi.mock("@/libs/monaco", () => ({}));

describe("CodeEditorInner", () => {
  it("renders label and validation state, then triggers change and blur", async () => {
    const user = userEvent.setup();

    useThemeSpy.mockReturnValue({ isDarkMode: true });

    const onChange = vi.fn();
    const onBlur = vi.fn();
    const monacoBeforeMount = vi.fn();

    render(
      <>
        <CodeEditorInner
          label="Command"
          value="echo hi"
          required
          error="invalid"
          onChange={onChange}
          onBlur={onBlur}
          monacoBeforeMount={monacoBeforeMount}
        />
        <button>outside</button>
      </>,
    );

    expect(screen.getByText("Command")).toBeInTheDocument();
    expect(screen.getByText("invalid")).toBeInTheDocument();

    const label = screen.getByText("Command");
    expect(label).toHaveClass("is-required");

    const editor = screen.getByTestId("mock-monaco");
    expect(editor).toHaveAttribute("data-theme", "vs-dark");
    expect(editor).toHaveAttribute("data-language", "shell");

    await user.click(editor);
    await user.type(editor, "abc");
    await user.tab();

    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(monacoBeforeMount).toHaveBeenCalled();
  });

  it("uses light theme when dark mode is disabled", () => {
    useThemeSpy.mockReturnValue({ isDarkMode: false });

    render(<CodeEditorInner label="Command" value="echo hi" />);

    expect(screen.getByTestId("mock-monaco")).toHaveAttribute(
      "data-theme",
      "vs-light",
    );
  });

  it("does not call blur callback when focus stays inside editor container", async () => {
    const user = userEvent.setup();
    useThemeSpy.mockReturnValue({ isDarkMode: false });
    const onBlur = vi.fn();

    render(
      <CodeEditorInner
        label="Command"
        value="echo hi"
        onBlur={onBlur}
        headerContent={<button type="button">Inside header action</button>}
      />,
    );

    const editor = screen.getByTestId("mock-monaco");
    const control = editor.closest(".p-form__control");
    assert(control);

    const insideControlButton = document.createElement("button");
    insideControlButton.type = "button";
    insideControlButton.textContent = "Inside control";
    control.appendChild(insideControlButton);

    await user.click(editor);
    await user.click(screen.getByRole("button", { name: "Inside control" }));
    expect(onBlur).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Inside header action" }),
    );
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
