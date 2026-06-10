import { setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PageParamFilter from "../PageParamFilter";
import ResponsiveTableFilters from "./ResponsiveTableFilters";

describe("ResponsiveTableFilters", () => {
  const user = userEvent.setup();

  it("renders the filters on large screens", () => {
    setScreenSize("md");
    renderWithProviders(
      <ResponsiveTableFilters
        filters={[
          <PageParamFilter
            pageParamKey="status"
            key={0}
            label="Label 0"
            options={[]}
          />,
          <PageParamFilter
            pageParamKey="status"
            key={1}
            label="Label 1"
            options={[]}
          />,
          <span key="hello" />,
        ]}
      />,
    );

    expect(screen.getByText("Label 0")).toBeInTheDocument();
    expect(screen.getByText("Label 1")).toBeInTheDocument();
  });

  it("renders a dropdown on small screens", async () => {
    setScreenSize("sm");
    renderWithProviders(
      <ResponsiveTableFilters
        filters={[
          <PageParamFilter
            pageParamKey="status"
            key={0}
            label="Label 0"
            options={[]}
          />,
          <span key={1}>divider</span>,
          <PageParamFilter
            pageParamKey="status"
            key={2}
            label="Label 1"
            options={[]}
          />,
        ]}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Label 0" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("divider")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Label 1" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("button", { name: "Label 0" })).toBeInTheDocument();
    expect(screen.getByText("divider")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Label 1" })).toBeInTheDocument();
  });

  it("keeps the default (right-opening) items when there is room on the right", async () => {
    setScreenSize("sm");
    renderWithProviders(
      <ResponsiveTableFilters
        filters={[
          <PageParamFilter
            pageParamKey="status"
            key={0}
            label="Label 0"
            options={[]}
          />,
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("button", { name: "Label 0" })).toHaveIcon(
      "chevron-right",
    );
  });

  it("reverses the items to open left when the menu is near the right edge", async () => {
    const rectSpy = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockReturnValue({
        right: window.innerWidth,
        left: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => "",
      } as DOMRect);

    setScreenSize("sm");
    renderWithProviders(
      <ResponsiveTableFilters
        filters={[
          <PageParamFilter
            pageParamKey="status"
            key={0}
            label="Label 0"
            options={[]}
          />,
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("button", { name: "Label 0" })).toHaveIcon(
      "chevron-left",
    );

    rectSpy.mockRestore();
  });
});
