import { setEndpointStatus } from "@/tests/controllers/controller";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import AccessGroupInstanceCountCell from "./AccessGroupInstanceCountCell";
import type { AccessGroup } from "../../types";

const [accessGroup] = accessGroups;

const render = (group: AccessGroup = accessGroup) =>
  renderWithProviders(<AccessGroupInstanceCountCell accessGroup={group} />);

describe("AccessGroupInstanceCountCell", () => {
  it("renders a link with instance count", async () => {
    render();
    const link = await screen.findByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe(
      `/instances?accessGroups=${accessGroup.name}`,
    );
  });

  it("renders loading state", () => {
    setEndpointStatus("loading");
    render();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders non-clickable 0 instances", async () => {
    const emptyAccessGroup = accessGroups.find(
      (ag) => ag.name === "empty-access-group",
    );
    assert(emptyAccessGroup);

    render(emptyAccessGroup);
    await waitFor(() => {
      expect(screen.getByText("0 instances")).toBeInTheDocument();
    });
  });

  it("renders unable to determine on error", async () => {
    setEndpointStatus("error");
    render();
    await waitFor(() => {
      expect(screen.getByText("Unable to determine")).toBeInTheDocument();
    });
  });
});
