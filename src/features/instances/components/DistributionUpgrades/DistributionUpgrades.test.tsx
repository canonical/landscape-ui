import { instances } from "@/tests/mocks/instance";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import DistributionUpgrades from "./DistributionUpgrades";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";

const EXCLUDED_INSTANCE_ID_A = 11;
const EXCLUDED_INSTANCE_ID_B = 21;
const EXCLUDED_INSTANCE_ID_C = 65;

const EXCLUDED_INSTANCE_IDS = [
  EXCLUDED_INSTANCE_ID_A,
  EXCLUDED_INSTANCE_ID_B,
  EXCLUDED_INSTANCE_ID_C,
];

const eligibleSelectedInstances = instances
  .filter((instance) => instance.has_release_upgrades)
  .map((instance) => instance.id);

const ineligibleSelectedInstances = instances
  .filter((instance) => {
    const release = instance.distribution_info?.release;
    const distributor = instance.distribution_info?.distributor;

    if (!instance.distribution_info) {
      return true;
    }

    if (distributor === "Ubuntu Core") {
      return true;
    }

    if (distributor !== "Canonical" && distributor !== "Ubuntu") {
      return true;
    }

    if (EXCLUDED_INSTANCE_IDS.includes(instance.id)) {
      return true;
    }

    // Only compare release if defined
    if (release === undefined) {
      return true;
    }

    return !(release < "18.04" || release === "22.04");
  })
  .map((instance) => instance.id);

const props = {
  selectedInstances: eligibleSelectedInstances,
} satisfies ComponentProps<typeof DistributionUpgrades>;

describe("DistributionUpgrades", () => {
  const user = userEvent.setup();

  it("opens the confirmation modal from submit button", async () => {
    renderWithProviders(<DistributionUpgrades {...props} />);

    await expectLoadingState();

    await user.click(
      screen.getByRole("button", { name: /upgrade distributions/i }),
    );

    expect(
      screen.getByText(/upgrade distributions for \d+ instances/i),
    ).toBeInTheDocument();
  });

  it("creates upgrades and shows success notification on confirm", async () => {
    renderWithProviders(<DistributionUpgrades {...props} />);

    await expectLoadingState();

    await user.click(
      screen.getByRole("button", { name: /upgrade distributions/i }),
    );
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    const notificationTitle = await screen.findByText(
      "Distribution upgrades queued",
    );
    expect(notificationTitle).toBeInTheDocument();

    const openActivityButton = screen.getByRole("button", {
      name: /view details/i,
    });
    expect(openActivityButton).toBeInTheDocument();
  });

  it("does not show success notification when create request fails", async () => {
    renderWithProviders(<DistributionUpgrades {...props} />);

    await expectLoadingState();

    await user.click(
      screen.getByRole("button", { name: /upgrade distributions/i }),
    );

    setEndpointStatus("error");

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Distribution upgrades queued"),
      ).not.toBeInTheDocument();
    });
  });

  it("opens category instances modal and marks row as ineligible", async () => {
    renderWithProviders(
      <DistributionUpgrades
        selectedInstances={ineligibleSelectedInstances.slice(0, 3)}
      />,
    );

    await expectLoadingState();

    const cannotBeUpgradedRow = screen.getByRole("row", {
      name: /cannot be upgraded/i,
    });

    await user.click(
      within(cannotBeUpgradedRow).getByRole("button", {
        name: /\d+ instances/i,
      }),
    );

    expect(
      screen.getByRole("heading", { name: /cannot be upgraded/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /reason/i }),
    ).toBeInTheDocument();
  });

  it("keeps submit enabled and blocks confirmation when no eligible instances", async () => {
    renderWithProviders(
      <DistributionUpgrades
        selectedInstances={ineligibleSelectedInstances.slice(0, 3)}
      />,
    );

    await expectLoadingState();

    const submitButton = screen.getByRole("button", {
      name: /upgrade distributions/i,
    });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(
      await screen.findByText(
        /select at least one eligible instance to upgrade/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/upgrade distributions for \d+ instances/i),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /confirm/i }),
    ).not.toBeInTheDocument();
  });
});
