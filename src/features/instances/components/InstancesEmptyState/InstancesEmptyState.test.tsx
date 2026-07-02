import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InstancesEmptyState from "./InstancesEmptyState";

const getClassicDashboardUrlQuery = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async (importOriginal) => ({
  ...(await importOriginal()),
  useAuthHandle: () => ({
    getClassicDashboardUrlQuery,
  }),
}));

describe("InstancesEmptyState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    getClassicDashboardUrlQuery.mockReturnValue({
      data: {
        data: {
          url: "https://old-dashboard-url",
        },
      },
    });
  });

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

  it("renders register button when classic dashboard URL is available", () => {
    renderWithProviders(<InstancesEmptyState />);

    expect(
      screen.getByRole("button", { name: "Register instance" }),
    ).toBeInTheDocument();
  });

  it("does not render register button when classic dashboard URL is unavailable", () => {
    getClassicDashboardUrlQuery.mockReturnValue({ data: undefined });

    renderWithProviders(<InstancesEmptyState />);

    expect(
      screen.queryByRole("button", { name: "Register instance" }),
    ).not.toBeInTheDocument();
  });
});
