import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import RepositoryProfileListActions from "./RepositoryProfileListActions";

const [profile] = repositoryProfiles;

describe("RepositoryProfileListActions", () => {
  const user = userEvent.setup();

  it("opens actions menu and shows options", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);

    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );
    expect(
      screen.getByRole("button", { name: `Edit "${profile.title}" profile` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Remove "${profile.title}" repository profile`,
      }),
    ).toBeInTheDocument();
  });

  it("opens sidepanel when clicking edit button", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );
    await user.click(
      screen.getByRole("button", { name: `Edit "${profile.title}" profile` }),
    );

    expect(
      screen.getByRole("heading", { name: `Edit ${profile.title}` }),
    ).toBeInTheDocument();
  });

  it("opens modal when clicking remove button", async () => {
    renderWithProviders(<RepositoryProfileListActions profile={profile} />);
    await user.click(
      screen.getByRole("button", { name: `${profile.title} profile actions` }),
    );
    await user.click(
      screen.getByRole("button", {
        name: `Remove "${profile.title}" repository profile`,
      }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
