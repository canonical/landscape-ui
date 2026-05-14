import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import ChangePasswordForm from "./ChangePasswordForm";

describe("ChangePasswordForm", () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

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

  it("does not show new password inline error for non-required validation failures", async () => {
    renderWithProviders(<ChangePasswordForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByTestId("new-password");
    await userEvent.type(currentPasswordInput, "current");
    await userEvent.type(newPasswordInput, "weakpassword");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);

    // When the password has non-required errors, the inline error is not shown
    // (only "This field is required" triggers the inline error on new-password)
    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();
  });

  it("submits successfully and shows success notification", async () => {
    renderWithProviders(<ChangePasswordForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByTestId("new-password");
    const saveButton = screen.getByRole("button", { name: /save changes/i });

    await userEvent.type(currentPasswordInput, "OldPassword1");
    await userEvent.type(newPasswordInput, "NewPassword1");
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password changed successfully"),
      ).toBeInTheDocument();
    });
  });

  it("handles API error gracefully when changing password fails", async () => {
    setEndpointStatus({ status: "error", path: "password" });
    renderWithProviders(<ChangePasswordForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByTestId("new-password");
    const saveButton = screen.getByRole("button", { name: /save changes/i });

    await userEvent.type(currentPasswordInput, "OldPassword1");
    await userEvent.type(newPasswordInput, "NewPassword1");
    await userEvent.click(saveButton);

    await waitFor(() => {
      // Form stays mounted without crashing after error
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
    });
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
