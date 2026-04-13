import { setEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsContainer from "./PublicationsContainer";

describe("PublicationsContainer", () => {
  it("renders publications list data", async () => {
    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByRole("button", { name: publications[0].name }),
    ).toBeInTheDocument();
  });

  it("renders table empty message when API returns no publications", async () => {
    setEndpointStatus({ status: "empty", path: "publications" });

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByText(/no profiles found with the search/i),
    ).toBeInTheDocument();
  });
});
