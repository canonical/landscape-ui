import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { setEndpointStatus } from "@/tests/controllers/controller";
import {
  expectLoadingState,
  mockRangeBoundingClientRect,
  restoreRangeBoundingClientRect,
} from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import WslProfileNonCompliantInstancesList from "./WslProfileNonCompliantInstancesList";

const [wslProfile] = wslProfiles;
const [, applicationServer] = instances;

describe("WslProfileNonCompliantInstancesList", () => {
  beforeEach(() => {
    mockRangeBoundingClientRect();
  });

  afterEach(async () => {
    await act(async () => {
      /* flush pending callbacks */
    });
    restoreRangeBoundingClientRect();
    setEndpointStatus("default");
  });

  it("shows a loading state while instances are being fetched", async () => {
    renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    await expectLoadingState();
  });

  it("filters instances via the search box and clears the active filter chip", async () => {
    renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    expect(await screen.findByText("Application Server 2")).toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox"), "server{enter}");

    expect(screen.getByText("Search: server")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByText("Search: server")).not.toBeInTheDocument();
  });

  it("enables making instances compliant once instances are selected", async () => {
    renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    await screen.findByText("Application Server 2");

    const makeCompliantButton = screen.getByRole("button", {
      name: "Make compliant",
    });
    expect(makeCompliantButton).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Toggle all instances" }),
    );

    await waitFor(() => {
      expect(makeCompliantButton).not.toHaveAttribute("aria-disabled");
    });

    await userEvent.click(makeCompliantButton);

    expect(await screen.findByText("This will:")).toBeInTheDocument();
  });

  it("toggles selection of an individual instance", async () => {
    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: { count: 1, results: [applicationServer] },
    });

    renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    await screen.findByText(applicationServer.title);

    const checkbox = screen.getByRole("checkbox", {
      name: `Select ${applicationServer.title}`,
    });

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Make compliant" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("expands the WSL profiles cell when Show more is clicked", async () => {
    const instanceWithProfiles = {
      ...applicationServer,
      wsl_profiles: [...wslProfiles],
    };

    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: { count: 1, results: [instanceWithProfiles] },
    });

    const { container } = renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: /show more/i }),
    );

    expect(container.querySelector(".expandedRow")).toBeInTheDocument();
    expect(container.querySelector(".expandedCell")).toBeInTheDocument();
  });

  it("collapses the expanded WSL profiles cell when pressing Escape", async () => {
    const instanceWithProfiles = {
      ...applicationServer,
      wsl_profiles: [...wslProfiles],
    };

    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: { count: 1, results: [instanceWithProfiles] },
    });

    const { container } = renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: /show more/i }),
    );

    expect(container.querySelector(".expandedCell")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    expect(container.querySelector(".expandedCell")).not.toBeInTheDocument();
  });

  it("renders no data for an instance without a valid last ping time", async () => {
    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: {
        count: 1,
        results: [{ ...applicationServer, last_ping_time: null }],
      },
    });

    renderWithProviders(
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />,
    );

    const row = await screen.findByRole("row", {
      name: (name) => name.includes(applicationServer.title),
    });

    expect(within(row).getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
