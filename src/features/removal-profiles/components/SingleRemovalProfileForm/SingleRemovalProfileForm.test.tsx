import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SingleRemovalProfileForm from "./SingleRemovalProfileForm";
import { removalProfiles } from "@/tests/mocks/removalProfiles";

const [profile] = removalProfiles;
const user = userEvent.setup();

describe("SingleRemovalProfileForm", () => {
  it("submits correctly in add mode", async () => {
    renderWithProviders(<SingleRemovalProfileForm action="add" />);

    await user.type(screen.getByLabelText(/name/i), "New removal profile");
    await user.type(screen.getByLabelText(/removal timeframe/i), "15");
    await user.click(
      screen.getByRole("button", { name: /add removal profile/i }),
    );
  });

  it("submits correctly in edit mode", async () => {
    renderWithProviders(
      <SingleRemovalProfileForm action="edit" profile={profile} />,
    );

    const input = screen.getByLabelText(/name/i);
    await user.clear(input);
    await user.type(input, "Updated profile");

    await user.click(screen.getByRole("button", { name: /save changes/i }));
  });

  it("shows validation errors for bad input", async () => {
    renderWithProviders(<SingleRemovalProfileForm action="add" />);

    await user.type(screen.getByLabelText(/removal timeframe/i), "0");
    await user.click(
      screen.getByRole("button", { name: /add removal profile/i }),
    );

    expect(
      await screen.findByText(/timeframe must be at least 1/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });
});
