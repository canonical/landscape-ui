import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EmployeeInstancesTableActions from "./EmployeeInstancesTableActions";
import {
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
} from "@/tests/mocks/instance";

describe("EmployeeInstancesTableContextualMenu", () => {
  const user = userEvent.setup();

  it("renders the toggle button with the correct aria-label", () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceNoActivityNoKey} />,
    );

    expect(
      screen.getByLabelText(`${instanceNoActivityNoKey.title} profile actions`),
    ).toBeInTheDocument();
  });

  it("shows generate when no activity and no key", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceNoActivityNoKey} />,
    );

    await user.click(
      screen.getByLabelText(`${instanceNoActivityNoKey.title} profile actions`),
    );

    expect(
      screen.getByLabelText(
        `View ${instanceNoActivityNoKey.title} instance details`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText(
        `Generate ${instanceNoActivityNoKey.title} recovery key`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(
        `View ${instanceNoActivityNoKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(
        `Regenerate ${instanceNoActivityNoKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
  });

  it("shows view and regenerate when key exists without activity", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceNoActivityWithKey} />,
    );

    await user.click(
      screen.getByLabelText(
        `${instanceNoActivityWithKey.title} profile actions`,
      ),
    );

    expect(
      await screen.findByLabelText(
        `View ${instanceNoActivityWithKey.title} recovery key`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText(
        `Regenerate ${instanceNoActivityWithKey.title} recovery key`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(
        `Generate ${instanceNoActivityWithKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
  });

  it("shows view and regenerate when activity and key exist", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceActivityWithKey} />,
    );

    await user.click(
      screen.getByLabelText(`${instanceActivityWithKey.title} profile actions`),
    );

    expect(
      await screen.findByLabelText(
        `View ${instanceActivityWithKey.title} recovery key`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText(
        `Regenerate ${instanceActivityWithKey.title} recovery key`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(
        `Generate ${instanceActivityWithKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
  });

  it("shows regenerate only when activity exists without a key", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceActivityNoKey} />,
    );

    await user.click(
      screen.getByLabelText(`${instanceActivityNoKey.title} profile actions`),
    );

    expect(
      await screen.findByLabelText(
        `Regenerate ${instanceActivityNoKey.title} recovery key`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(
        `View ${instanceActivityNoKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(
        `Generate ${instanceActivityNoKey.title} recovery key`,
      ),
    ).not.toBeInTheDocument();
  });

  it("opens and confirms the sanitize modal", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceNoActivityNoKey} />,
    );

    await user.click(
      screen.getByLabelText(`${instanceNoActivityNoKey.title} profile actions`),
    );
    const sanitizeButton = screen.getByLabelText(
      `Sanitize ${instanceNoActivityNoKey.title} instance`,
    );
    await user.click(sanitizeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveTextContent(
      `Sanitize "${instanceNoActivityNoKey.title}" instance`,
    );

    const confirmButton = within(modal).getByRole("button", {
      name: "Sanitize",
    });
    expect(confirmButton).toBeDisabled();

    const input = within(modal).getByRole("textbox");
    await user.clear(input);
    await user.type(input, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, `sanitize ${instanceNoActivityNoKey.title}`);
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens and confirms the remove modal", async () => {
    renderWithProviders(
      <EmployeeInstancesTableActions instance={instanceNoActivityNoKey} />,
    );

    await user.click(
      screen.getByLabelText(`${instanceNoActivityNoKey.title} profile actions`),
    );
    const removeButton = screen.getByLabelText(
      `Remove ${instanceNoActivityNoKey.title} from Landscape`,
    );
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveTextContent(
      `Remove ${instanceNoActivityNoKey.title} from Landscape`,
    );

    const confirmButton = within(modal).getByRole("button", {
      name: "Remove",
    });
    expect(confirmButton).toBeDisabled();

    const input = within(modal).getByRole("textbox");
    await user.clear(input);
    await user.type(input, "wrong text");
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, `remove ${instanceNoActivityNoKey.title}`);
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
