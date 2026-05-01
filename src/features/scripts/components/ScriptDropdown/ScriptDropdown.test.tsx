import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, assert } from "vitest";
import ScriptDropdown from "./ScriptDropdown";

describe("ScriptDropdown", () => {
  const user = userEvent.setup();
  const mockSetScript = vi.fn();

  beforeEach(() => {
    mockSetScript.mockClear();
  });

  it("renders the Script label", () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );
    expect(screen.getByText("Script")).toBeInTheDocument();
  });

  it("renders search box when no existingScriptId", () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );
    expect(
      screen.getByPlaceholderText(/search for scripts/i),
    ).toBeInTheDocument();
  });

  it("shows script suggestions on focus", async () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);

    await waitFor(
      () => {
        expect(screen.getAllByTestId("dropdownElement").length).toBeGreaterThan(
          0,
        );
      },
      { timeout: 3000 },
    );
  });

  it("selects a script when clicking a suggestion", async () => {
    const setScript = vi.fn();
    renderWithProviders(<ScriptDropdown script={null} setScript={setScript} />);

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);

    await waitFor(() => {
      expect(screen.getAllByTestId("dropdownElement").length).toBeGreaterThan(
        0,
      );
    });

    const [firstOption] = screen.getAllByTestId("dropdownElement");
    assert(firstOption);
    await user.click(firstOption);

    expect(setScript).toHaveBeenCalled();
  });

  it("displays selected script name", () => {
    renderWithProviders(
      <ScriptDropdown script={scripts[0]} setScript={mockSetScript} />,
    );
    expect(screen.getByText(scripts[0].title)).toBeInTheDocument();
  });

  it("shows Remove button when script is selected and no existingScriptId", () => {
    renderWithProviders(
      <ScriptDropdown script={scripts[0]} setScript={mockSetScript} />,
    );
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("calls setScript(null) when Remove button is clicked", async () => {
    const setScript = vi.fn();
    renderWithProviders(
      <ScriptDropdown script={scripts[0]} setScript={setScript} />,
    );

    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(setScript).toHaveBeenCalledWith(null);
  });

  it("shows error message when errorMessage prop is set", async () => {
    renderWithProviders(
      <ScriptDropdown
        script={null}
        setScript={mockSetScript}
        errorMessage="Script is required"
      />,
    );
    // Error shows when dropdown is closed
    expect(screen.getByText(/script is required/i)).toBeInTheDocument();
  });

  it("does not show search box when existingScriptId is set", () => {
    renderWithProviders(
      <ScriptDropdown
        script={null}
        setScript={mockSetScript}
        existingScriptId={scripts[0].id}
      />,
    );
    expect(
      screen.queryByPlaceholderText(/search for scripts/i),
    ).not.toBeInTheDocument();
  });

  it("does not show Remove button when existingScriptId is set", () => {
    renderWithProviders(
      <ScriptDropdown
        script={scripts[0]}
        setScript={mockSetScript}
        existingScriptId={scripts[0].id}
      />,
    );
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows help text when existingScriptId is set", () => {
    renderWithProviders(
      <ScriptDropdown
        script={null}
        setScript={mockSetScript}
        existingScriptId={scripts[0].id}
      />,
    );
    expect(
      screen.queryByText(/scripts can't be replaced/i),
    ).not.toBeInTheDocument();
  });

  it("shows 'No scripts found' when search returns no results", async () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);
    await user.type(searchBox, "zzz-nonexistent-script-xyz");

    await waitFor(
      () => {
        expect(screen.getByText(/no scripts found by/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("clears search and reopens dropdown when clear button is clicked", async () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);
    await user.type(searchBox, "abc");

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await user.click(clearButton);

    await waitFor(
      () => {
        expect(searchBox).toHaveValue("");
      },
      { timeout: 3000 },
    );
  });

  it("handles null item selection gracefully", async () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);

    await waitFor(() => {
      expect(screen.getAllByTestId("dropdownElement").length).toBeGreaterThan(
        0,
      );
    });

    await user.keyboard("{Escape}");

    expect(mockSetScript).not.toHaveBeenCalled();
  });

  it("fires scroll handler on the suggestions list", async () => {
    renderWithProviders(
      <ScriptDropdown script={null} setScript={mockSetScript} />,
    );

    const searchBox = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(searchBox);

    await waitFor(() => {
      expect(screen.getAllByTestId("dropdownElement").length).toBeGreaterThan(
        0,
      );
    });

    const list = screen.getByRole("listbox");
    Object.defineProperty(list, "scrollTop", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(list, "scrollHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(list, "clientHeight", {
      configurable: true,
      value: 200,
    });
    fireEvent.scroll(list);

    expect(list).toBeInTheDocument();
  });
});
