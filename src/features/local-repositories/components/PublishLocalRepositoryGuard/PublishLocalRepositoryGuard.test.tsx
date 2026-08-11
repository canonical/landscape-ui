import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublishLocalRepositoryGuard from "./PublishLocalRepositoryGuard";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("PublishLocalRepositoryGuard", () => {
  const close = vi.fn();

  it("does nothing when not open", () => {
    renderWithProviders(
      <>
        <PublishLocalRepositoryGuard
          close={close}
          isOpen={false}
          repository={repositories[0]}
        />
        <LocationDisplay />
      </>,
    );

    expect(getLocationDisplay()).toHaveTextContent("/");
    expect(
      screen.queryByRole("heading", {
        name: /no publication targets have been added/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("pushes publish side path when publication targets exist", async () => {
    renderWithProviders(
      <>
        <PublishLocalRepositoryGuard
          close={close}
          isOpen={true}
          repository={repositories[0]}
        />
        <LocationDisplay />
      </>,
    );

    await waitFor(() => {
      const locationProbe = getLocationDisplay();
      expect(locationProbe).toHaveTextContent("sidePath=publish");
      expect(locationProbe).toHaveTextContent("name=aaaa-bbbb-cccc");
    });
  });

  it("renders no-targets modal when endpoint returns no publication targets", async () => {
    setEndpointStatus("empty");

    renderWithProviders(
      <PublishLocalRepositoryGuard
        close={close}
        isOpen={true}
        repository={repositories[0]}
      />,
    );

    expect(
      await screen.findByRole("heading", {
        name: /no publication targets have been added/i,
      }),
    ).toBeInTheDocument();
  });
});
