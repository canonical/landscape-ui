import * as Constants from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { authResponse } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(true);
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);
    setEndpointStatus("default");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders instances page content with list data", async () => {
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Instances" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
  });

  it("shows the current account and registration guide in the tooltip", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      status: "variant",
      path: "tooltip",
      response: authResponse,
    });
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    const informationIcon = document.querySelector(".p-icon--information");
    expect(informationIcon).toBeInTheDocument();
    await user.hover(informationIcon as Element);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Account name: test-account");

    const registrationGuideLink = within(tooltip).getByRole("link", {
      name: "Learn how to register new instances to your Landscape organization",
    });
    expect(registrationGuideLink).toHaveAttribute(
      "href",
      "https://ubuntu.com/landscape/docs/how-to-guides/landscape-installation-and-set-up/configure-landscape-client/",
    );
  });

  it("shows empty state when instances endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "computers" });

    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any instances registered to Landscape yet.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("does not show the report panel for a stale report side path when feature is disabled", async () => {
    vi.spyOn(Constants, "REPORT_VIEW_ENABLED", "get").mockReturnValue(false);

    renderWithProviders(<InstancesPage />, {}, "/?sidePath=report");

    await expectLoadingState();

    expect(
      screen.queryByRole("heading", { name: /instance summary report/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show the export panel for a stale export side path", async () => {
    renderWithProviders(<InstancesPage />, {}, "/?sidePath=export");

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Generate TSV" }),
    ).not.toBeInTheDocument();
  });
});
