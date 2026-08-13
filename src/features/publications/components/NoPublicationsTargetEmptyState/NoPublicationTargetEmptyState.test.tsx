import { ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import NoPublicationTargetEmptyState from "./NoPublicationTargetEmptyState";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

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
    ).toHaveAttribute("href", DEBARCHIVE_DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("navigates to the add publication target route when CTA is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <NoPublicationTargetEmptyState />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.repositories.publicationTargets({ sidePath: ["add"] }),
    );
  });
});
