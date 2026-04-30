import { setEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsContainer from "./PublicationsContainer";
import { expectLoadingState } from "@/tests/helpers";

describe("PublicationsContainer", () => {
  it("renders publications list data", async () => {
    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByRole("button", {
        name: publications[0].displayName,
      }),
    ).toBeInTheDocument();
  });

  it("renders publication target empty state when there are no publication targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByText(
        /you must first add a publication target in order to add a publication/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders publication empty state when there are no publications", async () => {
    setEndpointStatus({ status: "empty", path: "publications" });

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByText(/you don.t have any publications yet/i),
    ).toBeInTheDocument();
  });

  it("does not render button to add publication when there are no publication targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationsContainer />);
    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Add publication" }),
    ).not.toBeInTheDocument();
  });

  it("does not render button to add publication when there are no publications", async () => {
    setEndpointStatus({ status: "empty", path: "publications" });

    renderWithProviders(<PublicationsContainer />);
    await expectLoadingState();
    expect(
      screen.queryByRole("button", { name: "Add publication" }),
    ).not.toBeInTheDocument();
    screen.debug();
  });
});
