import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FC } from "react";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import NoPublicationTargetsModal from "./NoPublicationTargetsModal";

const LocationProbe: FC = () => {
  const location = useLocation();

  return (
    <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>
  );
};

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

  it("calls close callback on cancel", async () => {
    renderWithProviders(<NoPublicationTargetsModal close={close} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
