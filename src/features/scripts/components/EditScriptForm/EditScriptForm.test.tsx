import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import EditScriptForm from "./EditScriptForm";

const [script] = scripts;

describe("EditScriptForm", () => {
  const user = userEvent.setup();

  it("should display edit script form", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/code/i)).toBeInTheDocument();
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/submit new version/i)).toBeInTheDocument();
  });

  it("should show disabled buttons", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    const submitNewVersion = screen.getByRole("button", {
      name: /submit new version/i,
    });

    expect(submitNewVersion).toBeInTheDocument();
    expect(submitNewVersion).toHaveAttribute("aria-disabled", "true");
  });

  it("should enable buttons when the form is modified", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    await user.type(screen.getByRole("textbox", { name: /title/i }), " edited");

    expect(
      screen.getByRole("button", { name: /submit new version/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("should show the edit confirmation modal when 'Submit new version' is clicked", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    await user.type(screen.getByRole("textbox", { name: /title/i }), " edited");
    await user.click(
      screen.getByRole("button", { name: /submit new version/i }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: /submit new version/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit the new version and show a success notification", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    await user.type(screen.getByRole("textbox", { name: /title/i }), " edited");
    await user.click(
      screen.getByRole("button", { name: /submit new version/i }),
    );

    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: /submit new version/i,
      }),
    );

    expect(
      await screen.findByText(/successfully submitted a new version/i),
    ).toBeInTheDocument();
  });
});
