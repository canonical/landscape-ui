import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { aptSources } from "@/tests/mocks/apt-sources";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, vi } from "vitest";
import RepositoryProfileForm from "./RepositoryProfileForm";

describe("RepositoryProfileForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("submits without errors on valid add form", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[aptSources[0]]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Profile name/i), "repo-test");
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders save changes button on edit action", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="edit"
        profile={repositoryProfiles[0]}
        aptSources={repositoryProfiles[0].apt_sources}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    const saveButton = await screen.findByRole("button", {
      name: /save changes/i,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("type", "submit");
    expect(saveButton).toHaveTextContent(/Save changes/i);
  });

  it("submits edit form successfully and shows no errors", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="edit"
        profile={repositoryProfiles[0]}
        aptSources={repositoryProfiles[0].apt_sources}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await screen.findByDisplayValue(repositoryProfiles[0].title);
    await user.click(
      screen.getByRole("button", {
        name: /Save changes to repository profile/i,
      }),
    );

    expect(
      screen.queryByText(/this field is required/i),
    ).not.toBeInTheDocument();
  });

  it("shows validation error for required title field in add mode", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /Add a new repository profile/i,
      }),
    );

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("shows apt_sources validation error when no sources are added", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Profile name/i), "repo-test");
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(/at least one source is required/i),
    ).toBeInTheDocument();
  });

  it("shows enabled access group field in add mode", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/access group/i)).toBeEnabled();
  });

  it("shows read-only access group field in edit mode", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="edit"
        profile={repositoryProfiles[0]}
        aptSources={repositoryProfiles[0].apt_sources}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("combobox", { name: /access group/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onAddSourceClick when clicking Add source", async () => {
    const onAddSourceClick = vi.fn();
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={onAddSourceClick}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(onAddSourceClick).toHaveBeenCalled();
  });
  it("shows error notification when create API call fails", async () => {
    setEndpointStatus({ status: "error", path: "repositoryprofiles" });

    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[aptSources[0]]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Profile name/i), "repo-test");
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("shows success notification after successful create", async () => {
    renderWithProviders(
      <RepositoryProfileForm
        action="add"
        aptSources={[aptSources[0]]}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Profile name/i), "repo-test");
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(/repository profile created/i),
    ).toBeInTheDocument();
  });

  it("shows success notification after successful edit", async () => {
    const [profile] = repositoryProfiles;
    renderWithProviders(
      <RepositoryProfileForm
        action="edit"
        profile={profile}
        aptSources={profile.apt_sources}
        onAptSourcesChange={vi.fn()}
        onAddSourceClick={vi.fn()}
        onEditSourceClick={vi.fn()}
      />,
    );

    await screen.findByDisplayValue(profile.title);
    await user.click(
      screen.getByRole("button", {
        name: /Save changes to repository profile/i,
      }),
    );

    expect(
      await screen.findByText(
        new RegExp(`successfully edited ${profile.title}`, "i"),
      ),
    ).toBeInTheDocument();
  });
});
