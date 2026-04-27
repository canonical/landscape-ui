import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";
import { useLocation } from "react-router";
import PublicationTargetListActions from "./PublicationTargetListActions";

vi.mock("../../api/useGetPublicationsByTarget", () => ({
  default: vi.fn(),
}));

vi.mock("../../api/useRemovePublicationTarget", () => ({
  default: vi.fn(() => ({
    removePublicationTargetQuery: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
  })),
}));

import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const targetWithDisplayName = publicationTargets[0]!;

describe("PublicationTargetListActions", () => {
  const user = userEvent.setup();

  it("renders the actions toggle button with display_name", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <>
        <PublicationTargetListActions target={targetWithDisplayName} />
        <LocationDisplay />
      </>,
    );

    expect(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    ).toBeInTheDocument();
  });

  it("shows View details, Edit, and Remove actions in the dropdown", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <>
        <PublicationTargetListActions target={targetWithDisplayName} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );

    expect(
      await screen.findByRole("menuitem", {
        name: `View details for ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", {
        name: `Edit ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("sets sidePath=view and name in URL when View details is clicked", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <>
        <PublicationTargetListActions target={targetWithDisplayName} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `View details for ${targetWithDisplayName.displayName}`,
      }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=view");
    expect(screen.getByTestId("location")).toHaveTextContent(
      `name=${targetWithDisplayName.publicationTargetId}`,
    );
  });

  it("sets sidePath=edit and name in URL when Edit is clicked", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <>
        <PublicationTargetListActions target={targetWithDisplayName} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `Edit ${targetWithDisplayName.displayName}`,
      }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=edit");
    expect(screen.getByTestId("location")).toHaveTextContent(
      `name=${targetWithDisplayName.publicationTargetId}`,
    );
  });

  it("opens remove confirmation dialog when Remove is clicked", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <>
        <PublicationTargetListActions target={targetWithDisplayName} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${targetWithDisplayName.displayName} actions`,
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: `Remove ${targetWithDisplayName.displayName}`,
      }),
    ).toBeInTheDocument();
  });
});
