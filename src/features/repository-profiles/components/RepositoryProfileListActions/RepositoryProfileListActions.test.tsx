import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, it, expect } from "vitest";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import RepositoryProfileListActions from "./RepositoryProfileListActions";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const [profile] = repositoryProfiles;

describe("RepositoryProfileListActions", () => {
  const user = userEvent.setup();

  const openMenu = async () => {
    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );
  };

  const openRemoveModal = async () => {
    await openMenu();
    await user.click(
      screen.getByRole("menuitem", {
        name: `Remove "${profile.title}" repository profile`,
      }),
    );
  };

  it("opens actions menu and shows options", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);

    await openMenu();
    expect(
      screen.getByRole("menuitem", { name: `Edit "${profile.title}" profile` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Remove "${profile.title}" repository profile`,
      }),
    ).toBeInTheDocument();
  });

  it("sets sidePath=edit and name in URL when clicking edit button", async () => {
    renderWithProviders(
      <>
        <RepositoryProfileListActions profile={profile} />
        <LocationDisplay />
      </>,
    );
    await openMenu();
    await user.click(
      screen.getByRole("menuitem", { name: `Edit "${profile.title}" profile` }),
    );

    const locationEl = screen.getByTestId("location");
    expect(locationEl).toHaveTextContent(`sidePath=edit`);
    expect(locationEl).toHaveTextContent(`name=${profile.name}`);
  });

  it("opens modal when clicking remove button", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    await openRemoveModal();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("keeps Remove button disabled until confirmation text is typed", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    await openRemoveModal();

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toHaveAttribute("aria-disabled", "true");

    await user.type(screen.getByRole("textbox"), `remove ${profile.title}`);
    expect(removeButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows success notification after successful profile removal", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    await openRemoveModal();

    await user.type(screen.getByRole("textbox"), `remove ${profile.title}`);
    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      await screen.findByText("Repository profile removed"),
    ).toBeInTheDocument();
  });

  it("shows error notification when removal fails", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    setEndpointStatus({ status: "error", path: "RemoveRepositoryProfile" });

    await openRemoveModal();
    await user.type(screen.getByRole("textbox"), `remove ${profile.title}`);
    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
