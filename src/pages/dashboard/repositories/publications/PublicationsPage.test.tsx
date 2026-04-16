import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import PublicationsPage from "./PublicationsPage";

const LocationDisplay: FC = () => {
  const { search } = useLocation();
  return <output data-testid="location-search">{search}</output>;
};

describe("PublicationsPage", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  it("renders without a side panel open by default", () => {
    renderWithProviders(<PublicationsPage />);

    expect(
      screen.queryByRole("heading", { name: publication.name }),
    ).not.toBeInTheDocument();
  });

  it("opens the view side panel when sidePath=view and publication param are set", async () => {
    renderWithProviders(
      <PublicationsPage />,
      undefined,
      `/?sidePath=view&publication=${publication.publicationId}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: publication.name,
      }),
    ).toBeInTheDocument();
  });

  it("closes the side panel when the close button is clicked", async () => {
    renderWithProviders(
      <>
        <PublicationsPage />
        <LocationDisplay />
      </>,
      undefined,
      `/?sidePath=view&publication=${publication.publicationId}`,
    );

    // Wait for panel content to fully load before closing
    await within(screen.getByLabelText("Side panel")).findByRole("heading", {
      name: publication.name,
    });
    await user.click(screen.getByLabelText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: publication.name }),
      ).not.toBeInTheDocument();
    });

    const searchParams = new URLSearchParams(
      screen.getByTestId("location-search").textContent ?? "",
    );
    expect(searchParams.get("sidePath")).toBeNull();
    expect(searchParams.get("publication")).toBeNull();
  });
});
