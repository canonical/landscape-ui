import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FC } from "react";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import NoPublicationTargetEmptyState from "./NoPublicationTargetEmptyState";
import { DOCUMENTATION_URL } from "./constants";

const LocationProbe: FC = () => {
  const location = useLocation();

  return (
    <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>
  );
};

describe("NoPublicationTargetEmptyState", () => {
  it("renders title, docs link and CTA button", () => {
    renderWithProviders(<NoPublicationTargetEmptyState />);

    expect(
      screen.getByText(
        /you must first add a publication target in order to add a publication/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("navigates to the add publication target route when CTA is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <NoPublicationTargetEmptyState />
        <LocationProbe />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(screen.getByTestId("location-probe")).toHaveTextContent(
      ROUTES.repositories.publicationTargets({ sidePath: ["add"] }),
    );
  });
});
