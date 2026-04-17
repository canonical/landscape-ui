import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileForm from "./RepositoryProfileForm";

const user = userEvent.setup();

const fillAndAddSource = async () => {
  await user.click(
    screen.getByRole("button", { name: /add source/i }),
  );
  await user.type(
    await screen.findByLabelText(/source name/i),
    "my-source",
  );
  await user.type(
    screen.getByLabelText(/deb line/i),
    "deb http://archive.ubuntu.com/ubuntu focal main",
  );
  await user.click(screen.getByRole("button", { name: /save changes/i }));
};

describe("RepositoryProfileForm", () => {
  it("submits without errors on valid add form", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.type(screen.getByLabelText(/Title/i), "repo-test");
    await fillAndAddSource();

    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders save changes button on edit action", async () => {
    renderWithProviders(
      <RepositoryProfileForm action="edit" profile={repositoryProfiles[0]} />,
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
      <RepositoryProfileForm action="edit" profile={repositoryProfiles[0]} />,
    );

    const saveButton = await screen.findByRole("button", {
      name: /Save changes to repository profile/i,
    });
    await user.click(saveButton);

    expect(screen.queryByText(/this field is required/i)).not.toBeInTheDocument();
  });

  it("shows validation error for required title field in add mode", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("shows apt_sources validation error when no sources are added", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.type(screen.getByLabelText(/Title/i), "repo-test");
    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(/at least one source is required/i),
    ).toBeInTheDocument();
  });

  it("shows enabled access group field in add mode", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    expect(screen.getByLabelText(/access group/i)).toBeEnabled();
  });

  it("shows disabled access group field in edit mode", async () => {
    renderWithProviders(
      <RepositoryProfileForm action="edit" profile={repositoryProfiles[0]} />,
    );

    expect(screen.getByLabelText(/access group/i)).toBeDisabled();
  });

  it("clicking Add source opens the source form overlay", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(
      await screen.findByLabelText(/source name/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/deb line/i)).toBeInTheDocument();
  });

  it("shows error notification when create API call fails", async () => {
    renderWithProviders(<RepositoryProfileForm action="add" />);

    setEndpointStatus({ status: "error", path: "repositoryprofiles" });

    await user.type(screen.getByLabelText(/Title/i), "repo-test");
    await fillAndAddSource();

    await user.click(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
