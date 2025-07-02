import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SecurityProfileDetails from "./SecurityProfileDetails";

describe("SecurityProfileDetails", () => {
  const [, , profile] = securityProfiles;

  it("should render without data", async () => {
    renderWithProviders(
      <SecurityProfileDetails
        actions={{
          archive: () => undefined,
          downloadAudit: () => undefined,
          duplicate: () => undefined,
          edit: () => undefined,
          run: () => undefined,
          viewDetails: () => undefined,
        }}
        profile={{
          ...profile,
          next_run_time: null,
          last_run_results: {
            ...profile.last_run_results,
            timestamp: null,
          },
        }}
      />,
    );

    expect((await screen.findAllByText("---"))[0]).toBeInTheDocument();
    expect(screen.getByText("As soon as possible")).toBeInTheDocument();
  });

  it("should render with data", async () => {
    renderWithProviders(
      <SecurityProfileDetails
        actions={{
          archive: () => undefined,
          downloadAudit: () => undefined,
          duplicate: () => undefined,
          edit: () => undefined,
          run: () => undefined,
          viewDetails: () => undefined,
        }}
        profile={{
          ...profile,
          restart_deliver_delay: 1,
          restart_deliver_delay_window: 2,
        }}
      />,
    );

    expect(
      await screen.findByText(
        "Delayed by 1 hour, Randomize delivery over 2 minutes",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText("As soon as possible")).not.toBeInTheDocument();
  });
});
