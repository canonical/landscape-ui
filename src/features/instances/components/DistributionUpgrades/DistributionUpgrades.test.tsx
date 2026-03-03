import { instances } from "@/tests/mocks/instance";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import DistributionUpgrades from "./DistributionUpgrades";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";

const eligibleSelectedInstances = instances
  .filter((instance) => instance.has_release_upgrades)
  .map((instance) => instance.id);
const ineligibleSelectedInstances = instances
  .filter(
    (instance) =>
      !(
        instance.distribution_info &&
        instance.distribution_info.release < "18.04"
      ),
  )
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
});
