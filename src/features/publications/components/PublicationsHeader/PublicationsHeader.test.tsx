import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FC } from "react";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import PublicationsHeader from "./PublicationsHeader";

const LocationProbe: FC = () => {
  const location = useLocation();

  return (
    <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>
  );
};

describe("PublicationsHeader", () => {
  it("renders search input", () => {
    renderWithProviders(<PublicationsHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("updates the query param when search is submitted", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <PublicationsHeader />
        <LocationProbe />
      </>,
    );

    await user.type(screen.getByRole("searchbox"), "jammy");
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("location-probe")).toHaveTextContent(
      "query=jammy",
    );
  });
});
