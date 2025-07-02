import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
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

  it("should display confirmation modal when submitting changes", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    const submitButton = screen.getByRole("button", {
      name: /submit new version/i,
    });

    await user.click(submitButton);

    expect(
      screen.getByText(
        /all future script runs will be done using the latest version of the code/i,
      ),
    ).toBeInTheDocument();
  });
});
