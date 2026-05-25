import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetContainer from "./PublicationTargetContainer";

describe("PublicationTargetContainer", () => {
  it("renders the loading state while fetching", async () => {
    renderWithProviders(<PublicationTargetContainer />);

    await expectLoadingState();
  });

  it("renders an empty table when there are no targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByText(/no publication targets found with the search/i),
    ).toBeInTheDocument();
  });

  it("renders the publication targets list when targets are present", async () => {
    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("does not render the empty state when targets are present", async () => {
    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(
      screen.queryByText(/you don't have any publication targets yet/i),
    ).not.toBeInTheDocument();
  });
});
