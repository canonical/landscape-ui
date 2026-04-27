import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import ActivitiesPage from "./ActivitiesPage";

describe("ActivitiesPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders activities page content with list data", async () => {
    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No activities found")).not.toBeInTheDocument();
  });

  it("shows empty state when activities endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "activities" });

    renderWithProviders(<ActivitiesPage />);

    await expectLoadingState();

    expect(screen.getByText("No activities found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no activities yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
