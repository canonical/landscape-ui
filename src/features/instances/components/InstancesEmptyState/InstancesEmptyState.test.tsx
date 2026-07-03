import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesEmptyState from "./InstancesEmptyState";

describe("InstancesEmptyState", () => {
  it("renders empty-state title, body, and docs link", () => {
    renderWithProviders(<InstancesEmptyState />);

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any instances registered to Landscape yet.",
      ),
    ).toBeInTheDocument();

    const docsLink = screen.getByRole("link", {
      name: "How to manage instances in Landscape",
    });

    expect(docsLink).toHaveAttribute(
      "href",
      "https://documentation.ubuntu.com/landscape/how-to-guides/web-portal/classic-web-portal/manage-computers/",
    );
  });

  it("does not render register link", () => {
    renderWithProviders(<InstancesEmptyState />);

    expect(
      screen.queryByRole("link", { name: "Register a new instance" }),
    ).not.toBeInTheDocument();
  });
});
