import { ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import NoPublicationTargetsModal from "./NoPublicationTargetsModal";

describe("NoPublicationTargetsModal", () => {
  const user = userEvent.setup();
  const close = vi.fn();

  it("renders modal copy and actions", () => {
    renderWithProviders(<NoPublicationTargetsModal close={close} />);

    expect(
      screen.getByRole("heading", {
        name: /no publication targets have been added/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/must first add a publication target/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("navigates to publication target add route on confirm", async () => {
    renderWithProviders(
      <>
        <NoPublicationTargetsModal close={close} />
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

  it("calls close callback on cancel", async () => {
    renderWithProviders(<NoPublicationTargetsModal close={close} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
