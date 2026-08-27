import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import AccessGroupListActions from "./AccessGroupListActions";
import type { AccessGroupWithInstancesCount } from "../../types";

const accessGroup: AccessGroupWithInstancesCount = {
  name: "server",
  title: "Server machines",
  parent: "global",
  children: "",
  instancesCount: 3,
};

describe("AccessGroupListActions", () => {
  const user = userEvent.setup();

  it("renders the actions menu toggle button", () => {
    renderWithProviders(
      <AccessGroupListActions
        accessGroup={accessGroup}
        parentAccessGroupTitle="Global access"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: `${accessGroup.title} access group actions`,
      }),
    ).toBeInTheDocument();
  });

  it("opens the delete modal when Delete is clicked", async () => {
    renderWithProviders(
      <AccessGroupListActions
        accessGroup={accessGroup}
        parentAccessGroupTitle="Global access"
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${accessGroup.title} access group actions`,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: `Delete "${accessGroup.title}" access group`,
      }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("opens the details side panel when View details is clicked", async () => {
    renderWithProviders(
      <>
        <AccessGroupListActions
          accessGroup={accessGroup}
          parentAccessGroupTitle="Global access"
        />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${accessGroup.title} access group actions`,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: `View "${accessGroup.title}" access group details`,
      }),
    );

    const location = getLocationDisplay();
    expect(location).toHaveTextContent("sidePath=view");
    expect(location).toHaveTextContent(`name=${accessGroup.name}`);
  });
});
