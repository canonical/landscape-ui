import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import EditScriptForm from "./EditScriptForm";

const [script] = scripts;

describe("EditScriptForm", () => {
  it("should display edit script form", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    // expect(screen.getByText(/code/i)).toBeInTheDocument(); TODO: Re-enable once CodeEditor is test-friendly
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/submit new version/i)).toBeInTheDocument();
  });

  it("should show disabled buttons", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    const submitAndRunButton = screen.getByRole("button", {
      name: /submit and run/i,
    });

    const submitNewVersion = screen.getByRole("button", {
      name: /submit new version/i,
    });

    expect(submitNewVersion).toBeInTheDocument();
    expect(submitNewVersion).toHaveAttribute("aria-disabled", "true");

    expect(submitAndRunButton).toBeInTheDocument();
    expect(submitAndRunButton).toHaveAttribute("aria-disabled", "true");
  });
});
