import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import ViewAccessGroupSidePanel from "./ViewAccessGroupSidePanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

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
});
