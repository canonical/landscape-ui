import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import SingleUpgradeProfileForm from "./SingleUpgradeProfileForm";
import userEvent from "@testing-library/user-event";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";

describe("SingleUpgradeProfileForm", () => {
  it("should correct validate an empty form", async () => {
    const { container } = renderWithProviders(
      <SingleUpgradeProfileForm action="add" />,
    );

    expect(container).toHaveTexts([
      "Name",
      "Only upgrade security issues",
      "Remove packages that are no longer needed",
      "Access group",
      "Schedule",
      "Days",
      "At a specific time",
      "Hourly",
      "Time",
      "Expires after",
      "hours",
      "Randomise delivery over a time window",
      "No",
      "Yes",
      "Association",
      "Associate to all instances",
    ]);

    const submitButton = screen.getByText("Add upgrade profile");

    await userEvent.click(submitButton);

    expect(await screen.findAllByText(/Error/)).toHaveLength(5);
  });

  it("should submit form with correct values", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SingleUpgradeProfileForm action="add" />);

    const nameInput = screen.getByLabelText(/name/i);
    const securityIssuesOnlyCheckbox = screen.getByLabelText(
      "Only upgrade security issues",
    );
    const autoremoveCheckbox = screen.getByLabelText(
      "Remove packages that are no longer needed",
    );
    const accessGroupSelect = screen.getByLabelText(/access group/i);
    const fridayOption = screen.getByText("Friday");
    const hoursInput = screen.getByLabelText(/at hour/i);
    const minutesInput = screen.getByLabelText(/at minute/);
    const associationCheckbox = screen.getByLabelText(
      "Associate to all instances",
    );
    const submitButton = screen.getByText("Add upgrade profile");

    await user.type(nameInput, "Test profile");
    await user.click(securityIssuesOnlyCheckbox);
    await user.click(autoremoveCheckbox);
    await user.selectOptions(accessGroupSelect, "Desktop machines");
    await user.click(fridayOption);
    await user.type(hoursInput, "12");
    await user.type(minutesInput, "30");
    await user.click(associationCheckbox);

    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/upgrade profile added/i),
    ).toBeInTheDocument();
  });

  it("should use correct endpoint to submit", async () => {
    renderWithProviders(
      <SingleUpgradeProfileForm action="edit" profile={upgradeProfiles[0]} />,
    );

    const submitButton = screen.getByText("Save changes");

    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/upgrade profile updated/i),
    ).toBeInTheDocument();
  });
});
