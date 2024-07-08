import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ChangePasswordForm from "./ChangePasswordForm";

describe("ChangePasswordForm", () => {
  it("renders the form with correct fields", () => {
    const { container } = renderWithProviders(<ChangePasswordForm />);

    expect(container).toHaveTexts([
      "Current password",
      "New password",
      "Save changes",
      "8-50 characters",
      "Lower case letters (a-z)",
      "Upper case letters (A-Z)",
      "Numbers (0-9)",
    ]);
  });

  it("validates form fields and displays errors", async () => {
    renderWithProviders(<ChangePasswordForm />);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getAllByText("This field is required")).toHaveLength(2);
  });

  it("updates constraint status as user types new password", async () => {
    renderWithProviders(<ChangePasswordForm />);

    const newPasswordInput = screen.getByTestId("new-password");
    await userEvent.type(newPasswordInput, "S");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    expect(screen.getByText("8-50 characters").className).toContain("failed");
    expect(screen.getByText("Lower case letters (a-z)").className).toContain(
      "failed",
    );
    expect(screen.getByText("Upper case letters (A-Z)").className).toContain(
      "passed",
    );
    expect(screen.getByText("Numbers (0-9)").className).toContain("failed");

    await userEvent.clear(newPasswordInput);
    await userEvent.type(newPasswordInput, "Sh");
    expect(screen.getByText("Lower case letters (a-z)").className).toContain(
      "passed",
    );

    await userEvent.clear(newPasswordInput);
    await userEvent.type(newPasswordInput, "LongPassword");
    expect(screen.getByText("8-50 characters").className).toContain("passed");

    await userEvent.clear(newPasswordInput);
    await userEvent.type(newPasswordInput, "LongPassword123");
    expect(screen.getByText("Numbers (0-9)").className).toContain("passed");
  });
});
