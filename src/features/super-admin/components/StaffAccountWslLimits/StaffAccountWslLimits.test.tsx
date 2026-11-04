import type { WslFeatureLimits } from "@/features/super-admin";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authResponse } from "@/tests/mocks/auth";
import {
  createStaffAccounts,
  defaultWslFeatureLimits,
} from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WSL_LIMIT_FIELDS } from "../../constants";
import StaffAccountWslLimits from "./StaffAccountWslLimits";

vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

describe("StaffAccountWslLimits", () => {
  it("reopens the form with the saved limits and compares further changes against them", async () => {
    const user = userEvent.setup();
    const [staffAccount] = createStaffAccounts();
    assert(staffAccount);

    setStaffGlobalRoles(["AccountManager"]);
    setEndpointStatus({
      status: "variant",
      path: "me",
      response: {
        ...authResponse,
        global_roles: ["AccountManager"],
      },
    });

    const savedLimits: WslFeatureLimits = {
      max_windows_host_machines: 250,
      max_wsl_child_instances_per_host: 5,
      max_wsl_child_instance_profiles: 25,
    };

    renderWithProviders(<StaffAccountWslLimits staffAccount={staffAccount} />);

    await user.click(await screen.findByRole("button", { name: "Edit" }));

    for (const { name, label } of WSL_LIMIT_FIELDS) {
      const input = screen.getByRole("spinbutton", { name: label });
      expect(input).toHaveValue(defaultWslFeatureLimits[name]);
      await user.clear(input);
      await user.type(input, String(savedLimits[name]));
    }

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Save changes",
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    });
    for (const { name } of WSL_LIMIT_FIELDS) {
      expect(
        screen.getByText(savedLimits[name].toLocaleString("en")),
      ).toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "Edit" }));

    for (const { name, label } of WSL_LIMIT_FIELDS) {
      expect(screen.getByRole("spinbutton", { name: label })).toHaveValue(
        savedLimits[name],
      );
    }

    const hostLimit = screen.getByRole("spinbutton", {
      name: "Windows host machines",
    });
    await user.clear(hostLimit);
    await user.type(hostLimit, "300");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const changes = within(screen.getByRole("dialog")).getAllByRole("listitem");
    expect(changes).toHaveLength(1);
    expect(changes[0]).toHaveTextContent("Windows host machines: 250 → 300");
  });
});
