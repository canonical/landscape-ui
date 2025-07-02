import { employeeGroups } from "@/tests/mocks/employeeGroups";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeeGroupsListActions from "./EmployeeGroupsListActions";

const [employeeGroup] = employeeGroups;

describe("EmployeeGroupsListContextualMenu", () => {
  const user = userEvent.setup();

  it("renders the contextual menu toggle button with correct aria-label", () => {
    renderWithProviders(
      <EmployeeGroupsListActions employeeGroup={employeeGroup} />,
    );

    const toggleButton = screen.getByLabelText(`${employeeGroup.name} actions`);
    expect(toggleButton).toBeInTheDocument();
  });

  it("displays menu links when the toggle button is clicked", async () => {
    renderWithProviders(
      <EmployeeGroupsListActions employeeGroup={employeeGroup} />,
    );

    const toggleButton = screen.getByLabelText(`${employeeGroup.name} actions`);
    await user.click(toggleButton);

    const removeMenuItem = screen.getByLabelText(
      `Remove ${employeeGroup.name} employee group`,
    );
    expect(removeMenuItem).toBeInTheDocument();

    const assignMenuItem = screen.getByLabelText(
      `Assign an autoinstall file to ${employeeGroup.name} employee group`,
    );
    expect(assignMenuItem).toBeInTheDocument();
  });

  it("opens the confirmation modal when 'Remove' is clicked", async () => {
    renderWithProviders(
      <EmployeeGroupsListActions employeeGroup={employeeGroup} />,
    );

    const toggleButton = screen.getByLabelText(`${employeeGroup.name} actions`);
    await user.click(toggleButton);

    const removeMenuItem = screen.getByLabelText(
      `Remove ${employeeGroup.name} employee group`,
    );
    await user.click(removeMenuItem);

    const confirmationModal = screen.getByRole("dialog");
    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = within(confirmationModal).getByRole("button", {
      name: /remove/i,
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("opens the side panel when 'Assign autoinstall file' is clicked", async () => {
    renderWithProviders(
      <EmployeeGroupsListActions employeeGroup={employeeGroup} />,
    );

    const toggleButton = screen.getByLabelText(`${employeeGroup.name} actions`);
    await user.click(toggleButton);

    const assignMenuItem = screen.getByLabelText(
      `Assign an autoinstall file to ${employeeGroup.name} employee group`,
    );
    await user.click(assignMenuItem);
  });
});
