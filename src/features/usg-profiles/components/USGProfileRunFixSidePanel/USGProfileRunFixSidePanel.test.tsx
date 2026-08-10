import { API_URL } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import USGProfileRunFixSidePanel from "./USGProfileRunFixSidePanel";
import { ErrorBoundary } from "@sentry/react";

const LocationDisplay = () => {
  const { pathname, search } = useLocation();

  return <div data-testid="location-display">{`${pathname}${search}`}</div>;
};

const [restartDelayedProfile, usgProfile, restartImmediateProfile] =
  usgProfiles;

describe("USGProfileRunFixSidePanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<USGProfileRunFixSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("runs the profile and shows a success notification", async () => {
    renderWithProviders(
      <USGProfileRunFixSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Run" }));

    expect(
      await screen.findByText(
        `You have successfully initiated run of the ${usgProfile.title} USG profile`,
      ),
    ).toBeInTheDocument();
  });

  it("shows delayed and randomized restart delivery details", async () => {
    renderWithProviders(
      <USGProfileRunFixSidePanel />,
      undefined,
      `/?name=${restartDelayedProfile.id}`,
    );

    expect(
      await screen.findByRole("button", { name: "Run" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Restart instances")).toBeInTheDocument();
    expect(screen.getByText("Delayed by 10 hours")).toBeInTheDocument();
    expect(screen.getByText("Yes, over 20 minutes")).toBeInTheDocument();
  });

  it("shows immediate restart delivery details without randomization", async () => {
    renderWithProviders(
      <USGProfileRunFixSidePanel />,
      undefined,
      `/?name=${restartImmediateProfile.id}`,
    );

    expect(
      await screen.findByRole("button", { name: "Run" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Restart instances")).toBeInTheDocument();
    expect(screen.getByText("As soon as possible")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("navigates to the activity details from the success notification", async () => {
    server.use(
      http.post(`${API_URL}usg-profiles/:id\\:execute`, () =>
        HttpResponse.json({ id: 123 }),
      ),
    );

    renderWithProviders(
      <>
        <USGProfileRunFixSidePanel />
        <LocationDisplay />
      </>,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Run" }));

    await userEvent.click(
      await screen.findByRole("button", { name: "View details" }),
    );

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      ROUTES.activities.root({ query: "parent-id:123" }),
    );
  });

  it("shows an error notification when running the profile fails", async () => {
    setEndpointStatus({ status: "error", path: "usg-profiles/execute" });

    renderWithProviders(
      <ErrorBoundary>
        <USGProfileRunFixSidePanel />
      </ErrorBoundary>,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Run" }));

    await expectErrorNotification();

    expect(
      screen.queryByText(
        `You have successfully initiated run of the ${usgProfile.title} USG profile`,
      ),
    ).not.toBeInTheDocument();
  });
});
