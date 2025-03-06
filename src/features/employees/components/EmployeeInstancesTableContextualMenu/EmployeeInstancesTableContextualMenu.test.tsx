import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import {
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeeInstancesTableContextualMenu from "./EmployeeInstancesTableContextualMenu";

const instance = instances[0];

describe("EmployeeInstancesTableContextualMenu", () => {
  const user = userEvent.setup();

  it("renders the toggle button with the correct aria-label", () => {
    renderWithProviders(
      <EmployeeInstancesTableContextualMenu instance={instance} />,
    );

    expect(
      screen.getByLabelText(`${instance.title} profile actions`),
    ).toBeInTheDocument();
  });

  it("displays contextual menu links when the toggle button is clicked", async () => {
    renderWithProviders(
      <EmployeeInstancesTableContextualMenu instance={instance} />,
    );

    await user.click(
      screen.getByLabelText(`${instance.title} profile actions`),
    );

    expect(
      screen.getByLabelText(`View ${instance.title} instance details`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Sanitize ${instance.title} instance`),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(`Remove from Landscape`)).toBeInTheDocument();
  });

  it("opens and confirms the sanitize modal", async () => {
    renderWithProviders(
      <EmployeeInstancesTableContextualMenu instance={instance} />,
    );

    await user.click(
      screen.getByLabelText(`${instance.title} profile actions`),
    );
    const sanitizeButton = screen.getByLabelText(
      `Sanitize ${instance.title} instance`,
    );
    await user.click(sanitizeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveTextContent(`Sanitize "${instance.title}" instance`);

    const confirmButton = within(modal).getByRole("button", {
      name: "Sanitize",
    });
    expect(confirmButton).toBeDisabled();

    const input = within(modal).getByRole("textbox");
    await user.clear(input);
    await user.type(input, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, `sanitize ${instance.title}`);
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);

    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });

  it("opens and confirms the remove modal", async () => {
    renderWithProviders(
      <EmployeeInstancesTableContextualMenu instance={instance} />,
    );

    await user.click(
      screen.getByLabelText(`${instance.title} profile actions`),
    );
    const removeButton = screen.getByLabelText("Remove from Landscape");
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveTextContent(`Remove ${instance.title} instance`);

    const confirmButton = within(modal).getByRole("button", {
      name: "Remove",
    });
    expect(confirmButton).toBeDisabled();

    const input = within(modal).getByRole("textbox");
    await user.clear(input);
    await user.type(input, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, `remove ${instance.title}`);
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });
});
