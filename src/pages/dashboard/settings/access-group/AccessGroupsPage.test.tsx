import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { PATHS, ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import AccessGroupsPage from "./AccessGroupsPage";

describe("AccessGroupsPage", () => {
  it("renders access groups table content", async () => {
    renderWithProviders(
      <AccessGroupsPage />,
      undefined,
      ROUTES.settings.accessGroups(),
      `/${PATHS.settings.root}/${PATHS.settings.accessGroups}`,
    );

    expect(
      screen.getByRole("heading", { name: "Access groups" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("rowheader", { name: "Global access" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add access group" }),
    ).toBeInTheDocument();
  });

  it("renders empty access groups state", async () => {
    setEndpointStatus("empty");

    renderWithProviders(
      <AccessGroupsPage />,
      undefined,
      ROUTES.settings.accessGroups(),
      `/${PATHS.settings.root}/${PATHS.settings.accessGroups}`,
    );

    expect(
      await screen.findByText("No access groups found"),
    ).toBeInTheDocument();
  });

  it("opens add access group side panel", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AccessGroupsPage />);

    await user.click(screen.getByRole("button", { name: "Add access group" }));

    expect(
      await screen.findByRole("heading", { name: "Add access group" }),
    ).toBeInTheDocument();
  });

  it("opens view access group side panel", async () => {
    renderWithProviders(
      <AccessGroupsPage />,
      undefined,
      `/?sidePath=view&name=desktop`,
    );

    expect(
      await screen.findByRole("heading", { name: "Desktop machines" }),
    ).toBeInTheDocument();
  });

  it("opens edit access group side panel", async () => {
    renderWithProviders(
      <AccessGroupsPage />,
      undefined,
      `/?sidePath=edit&name=server`,
    );

    expect(
      await screen.findByRole("heading", { name: "Edit Server machines" }),
    ).toBeInTheDocument();
  });
});
