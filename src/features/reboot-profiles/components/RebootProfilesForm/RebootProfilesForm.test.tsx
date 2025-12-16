import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RebootProfilesForm from "./RebootProfilesForm";

const [profile] = rebootProfiles;

describe("RebootProfilesForm", () => {
  const user = userEvent.setup();

  it("submits with correct values for add action", async () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    await user.type(screen.getByLabelText(/title/i), "New Test Profile");

    const dayCombobox = screen.getByRole("combobox", {
      name: /days/i,
    });

    await user.click(dayCombobox);

    await user.click(screen.getByText("Sunday"));
    await user.click(screen.getByText("Tuesday"));

    await user.type(screen.getByLabelText("at hour"), "10");
    await user.type(screen.getByLabelText("at minute"), "30");
    await user.type(screen.getByLabelText(/Expires after/i), "2");

    await user.click(
      screen.getByRole("button", { name: "Add reboot profile" }),
    );
  });

  it("submits with correct values for edit action", async () => {
    renderWithProviders(<RebootProfilesForm action="edit" profile={profile} />);

    const nameInput = screen.getByLabelText(/title/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated title");

    await user.click(screen.getByRole("button", { name: "Save changes" }));
  });

  it("shows validation errors for invalid input", async () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    await user.type(screen.getByLabelText("at hour"), "25");
    await user.type(screen.getByLabelText("at minute"), "65");
    await user.tripleClick(screen.getByLabelText("Expires after"));
    await user.keyboard("-1");

    await user.click(
      screen.getByRole("button", { name: "Add reboot profile" }),
    );

    expect(
      await screen.findByText("Hour must be between 0 and 23."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Minute must be between 0 and 59."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("At least one day must be selected."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("'Expires after' must be at least 0."),
    ).toBeInTheDocument();
  });

  it("shows enabled access group field in add mode", () => {
    renderWithProviders(<RebootProfilesForm action="add" />);

    expect(screen.getByLabelText(/access group/i)).toBeEnabled();
  });

  it("shows disabled access group field in edit mode", () => {
    renderWithProviders(<RebootProfilesForm action="edit" profile={profile} />);

    expect(screen.getByLabelText(/access group/i)).toBeDisabled();
  });
});
