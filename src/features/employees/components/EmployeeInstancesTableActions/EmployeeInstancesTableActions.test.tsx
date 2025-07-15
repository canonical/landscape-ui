import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeeInstancesTableActions from "./EmployeeInstancesTableActions";

const [instance] = instances;

describe("EmployeeInstancesTableContextualMenu", () => {
  const user = userEvent.setup();

  it("renders the toggle button with the correct aria-label", () => {
    renderWithProviders(<EmployeeInstancesTableActions instance={instance} />);

    expect(
      screen.getByLabelText(`${instance.title} profile actions`),
    ).toBeInTheDocument();
  });

  it("displays contextual menu links when the toggle button is clicked", async () => {
    renderWithProviders(<EmployeeInstancesTableActions instance={instance} />);

    await user.click(
      screen.getByLabelText(`${instance.title} profile actions`),
    );

    expect(
      screen.getByLabelText(`View ${instance.title} instance details`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Sanitize ${instance.title} instance`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Remove ${instance.title} from Landscape`),
    ).toBeInTheDocument();
  });

  it("opens and confirms the sanitize modal", async () => {
    renderWithProviders(<EmployeeInstancesTableActions instance={instance} />);

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

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens and confirms the remove modal", async () => {
    renderWithProviders(<EmployeeInstancesTableActions instance={instance} />);

    await user.click(
      screen.getByLabelText(`${instance.title} profile actions`),
    );
    const removeButton = screen.getByLabelText(
      `Remove ${instance.title} from Landscape`,
    );
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveTextContent(`Remove ${instance.title} from Landscape`);

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

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
