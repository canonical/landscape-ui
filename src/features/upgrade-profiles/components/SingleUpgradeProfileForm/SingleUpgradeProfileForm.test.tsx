import { tags } from "@/tests/mocks/tag";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SingleUpgradeProfileForm from "./SingleUpgradeProfileForm";

describe("SingleUpgradeProfileForm", () => {
  it("should render initial form state", async () => {
    const { container } = renderWithProviders(
      <SingleUpgradeProfileForm action="add" />,
    );

    expect(container).toHaveTexts([
      "Title",
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
      "Randomize delivery over a time window",
      "No",
      "Yes",
      "Association",
      "Associate to all instances",
    ]);

    expect(
      screen.getByRole("button", { name: /add upgrade profile/i }),
    ).toBeInTheDocument();
  });

  it("should submit form with correct values", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SingleUpgradeProfileForm action="add" />);

    const nameInput = screen.getByLabelText(/title/i);
    const securityIssuesOnlyCheckbox = screen.getByLabelText(
      "Only upgrade security issues",
    );
    const autoremoveCheckbox = screen.getByLabelText(
      "Remove packages that are no longer needed",
    );
    const accessGroupSelect = screen.getByLabelText(/access group/i);
    const hoursInput = screen.getByLabelText(/at hour/i);
    const minutesInput = screen.getByLabelText(/at minute/);
    const submitButton = screen.getByText("Add upgrade profile");

    await user.type(nameInput, "Test profile");
    await user.click(securityIssuesOnlyCheckbox);
    await user.click(autoremoveCheckbox);
    await user.selectOptions(accessGroupSelect, "Desktop machines");
    await user.click(screen.getByRole("combobox", { name: /days/i }));
    await user.click(await screen.findByText(/friday/i));
    await user.type(hoursInput, "12");
    await user.type(minutesInput, "30");
    await user.type(await screen.findByLabelText("Tags"), tags[0]);
    await user.click(screen.getByRole("checkbox", { name: tags[0] }));

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
