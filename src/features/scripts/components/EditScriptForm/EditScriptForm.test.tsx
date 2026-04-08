import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import EditScriptForm from "./EditScriptForm";

const [script] = scripts;

const props: ComponentProps<typeof EditScriptForm> = {
  script,
  onBack: vi.fn(),
};

describe("EditScriptForm", () => {
  const user = userEvent.setup();

  it("should display edit script form", async () => {
    renderWithProviders(<EditScriptForm {...props} />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/code/i)).toBeInTheDocument();
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/submit new version/i)).toBeInTheDocument();
  });

  it("should show the edit confirmation modal when 'Submit new version' is clicked", async () => {
    renderWithProviders(<EditScriptForm {...props} />);

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
    renderWithProviders(<EditScriptForm {...props} />);

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
