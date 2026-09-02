import { renderWithProviders } from "@/tests/render";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import ViewAccessGroupSidePanel from "./ViewAccessGroupSidePanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ErrorBoundary } from "@sentry/react";
import type { AccessGroup } from "@/features/access-groups";

const renderComponent = (name = "desktop") =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <ViewAccessGroupSidePanel />
    </Suspense>,
    undefined,
    `?sidePath=view&name=${name}`,
  );

describe("ViewAccessGroupSidePanel", () => {
  it("renders the header, details, and administrators", async () => {
    renderComponent("desktop");

    expect(
      await screen.findByRole("heading", { name: "Desktop machines" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Parent")).toBeInTheDocument();
    expect(screen.getByText("Global access")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Administrator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Role" }),
    ).toBeInTheDocument();
  });

  it("hides actions and parent for default access group", async () => {
    renderComponent("global");

    await screen.findByRole("heading", { name: "Details" });

    expect(screen.queryByText("Parent")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("renders children as clickable links", async () => {
    const user = userEvent.setup();
    renderComponent("global");

    expect(await screen.findByText("Children")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Desktop machines" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Server machines" }));
    expect(
      await screen.findByRole("heading", { name: "Server machines" }),
    ).toBeInTheDocument();
  });

  it("sets the edit side path and name in the URL when Edit is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ViewAccessGroupSidePanel />
        <LocationDisplay />
      </>,
      undefined,
      "?sidePath=view&name=desktop",
    );

    await user.click(await screen.findByRole("button", { name: "Edit" }));

    expect(getLocationDisplay()).toHaveTextContent("sidePath=view%2Cedit");
    expect(getLocationDisplay()).toHaveTextContent("name=desktop");
  });

  it("renders the delete button for non-default access groups", async () => {
    const user = userEvent.setup();
    renderComponent("desktop");

    await user.click(await screen.findByRole("button", { name: "Delete" }));
    expect(
      screen.getByRole("dialog", {
        name: "Deleting Desktop machines access group",
      }),
    ).toBeInTheDocument();
  });

  it("shows loading state while data is being fetched", async () => {
    setEndpointStatus("loading");
    renderComponent();

    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("throws when the access group is not found", async () => {
    setEndpointStatus({ status: "error", path: "GetAccessGroups" });

    renderWithProviders(
      <ErrorBoundary fallback={<p>error boundary fallback</p>}>
        <ViewAccessGroupSidePanel />
      </ErrorBoundary>,
      undefined,
      "?sidePath=view&name=nonexistent",
    );

    expect(
      await screen.findByText("error boundary fallback"),
    ).toBeInTheDocument();
  });

  it("falls back to raw parent name when parent is not in the list", async () => {
    const orphanGroup: AccessGroup = {
      name: "orphan",
      title: "Orphan Group",
      parent: "missing-parent",
      children: "",
    };
    setEndpointStatus({ status: "variant", response: [orphanGroup] });
    renderComponent("orphan");

    await screen.findByRole("heading", { name: "Orphan Group" });
    expect(
      screen.getByRole("button", { name: "missing-parent" }),
    ).toBeInTheDocument();
  });

  it("falls back to raw child name when child is not in the list", async () => {
    const parentGroup: AccessGroup = {
      name: "parent-group",
      title: "Parent Group",
      parent: "",
      children: "ghost-child",
    };
    setEndpointStatus({ status: "variant", response: [parentGroup] });
    renderComponent("parent-group");

    await screen.findByRole("heading", { name: "Parent Group" });
    expect(
      screen.getByRole("button", { name: "ghost-child" }),
    ).toBeInTheDocument();
  });
});
