import { setEndpointStatus } from "@/tests/controllers/controller";
import {
  createStaffAccounts,
  defaultWslFeatureLimits,
} from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WSL_LIMIT_FIELDS } from "../../constants";
import { WSL_LIMIT_MAX } from "./constants";
import EditStaffAccountWslLimitsForm from "./EditStaffAccountWslLimitsForm";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const [firstAccount] = createStaffAccounts();
assert(firstAccount);
const staffAccount = firstAccount;

const [firstField] = WSL_LIMIT_FIELDS;
assert(firstField);

const CHANGED_VALUE = defaultWslFeatureLimits[firstField.name] + 1000;

const renderForm = () =>
  renderWithProviders(
    <EditStaffAccountWslLimitsForm
      staffAccount={staffAccount}
      wslLimits={defaultWslFeatureLimits}
    />,
  );

const changeFirstLimitAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
  value: number = CHANGED_VALUE,
) => {
  const input = screen.getByRole("spinbutton", { name: firstField.label });
  await user.clear(input);
  await user.type(input, String(value));
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  return screen.findByRole("dialog");
};

describe("EditStaffAccountWslLimitsForm", () => {
  it("blocks submission when the value is too high", async () => {
    const user = userEvent.setup();
    renderForm();

    const input = screen.getByRole("spinbutton", { name: firstField.label });
    await user.clear(input);
    await user.type(input, String(WSL_LIMIT_MAX + 1));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        `Enter ${WSL_LIMIT_MAX.toLocaleString()} or less.`,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, String(WSL_LIMIT_MAX));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText(/Enter .* or less\./)).not.toBeInTheDocument();
  });

  it("submits without confirmation when nothing changed", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText("WSL limits have been saved"),
    ).not.toBeInTheDocument();
  });

  it("lists each changed limit in the confirmation", async () => {
    const user = userEvent.setup();
    renderForm();

    const dialog = await changeFirstLimitAndSubmit(user);

    expect(
      within(dialog).getByText(`${firstField.label}:`, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(CHANGED_VALUE.toLocaleString()),
    ).toBeInTheDocument();
  });

  it("keeps the form open when the confirmation is cancelled", async () => {
    const user = userEvent.setup();
    renderForm();

    const dialog = await changeFirstLimitAndSubmit(user);

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("spinbutton", { name: firstField.label }),
    ).toBeInTheDocument();
  });

  it("saves the limits and confirms success", async () => {
    setStaffGlobalRoles(["AccountManager"]);
    const user = userEvent.setup();
    renderForm();

    const dialog = await changeFirstLimitAndSubmit(user);
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText("WSL limits have been saved"),
    ).toBeInTheDocument();
  });

  it("surfaces an API error", async () => {
    setEndpointStatus({ status: "error", path: "wsl-feature-limits" });
    const user = userEvent.setup();
    renderForm();

    const dialog = await changeFirstLimitAndSubmit(user);
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
