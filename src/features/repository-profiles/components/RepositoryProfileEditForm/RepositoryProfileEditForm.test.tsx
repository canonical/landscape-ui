import { aptSources } from "@/tests/mocks/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileEditForm from "./RepositoryProfileEditForm";

vi.mock("../../api/useGetRepositoryProfile", () => ({
  useGetRepositoryProfile: vi.fn(() => ({ data: repositoryProfiles[0] })),
}));

const [profile] = repositoryProfiles;

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const renderEditForm = (sidePath = "view,edit") =>
  renderWithProviders(
    <>
      <RepositoryProfileEditForm />
      <LocationDisplay />
    </>,
    undefined,
    `/?sidePath=${sidePath}&name=${profile.name}`,
  );

describe("RepositoryProfileEditForm", () => {
  const user = userEvent.setup();

  it("renders the edit panel heading with the profile title", async () => {
    renderEditForm();

    expect(
      await screen.findByRole("heading", { name: `Edit ${profile.title}` }),
    ).toBeInTheDocument();
  });

  it("renders the repository profile form in edit mode", async () => {
    renderEditForm();

    expect(
      await screen.findByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("does not render back button when sidePath has only one segment", async () => {
    renderWithProviders(
      <RepositoryProfileEditForm />,
      undefined,
      `/?sidePath=edit&name=${profile.name}`,
    );

    await screen.findByRole("heading", { name: `Edit ${profile.title}` });

    expect(
      screen.queryByRole("button", { name: /back/i }),
    ).not.toBeInTheDocument();
  });

  it("renders back button when sidePath has more than one segment", async () => {
    renderEditForm("view,edit");

    expect(
      await screen.findByRole("button", { name: /back/i }),
    ).toBeInTheDocument();
  });

  it("closes the panel and clears URL params on close button click", async () => {
    renderEditForm();

    await screen.findByRole("heading", { name: `Edit ${profile.title}` });

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByTestId("location")).not.toHaveTextContent(
      `name=${profile.name}`,
    );
  });

  it("shows add-source breadcrumb header in add-source step", async () => {
    renderEditForm("view,edit,add-source");

    expect(
      await screen.findByRole("link", { name: `Edit ${profile.title}` }),
    ).toBeInTheDocument();
    expect(screen.getByText(/\/ Add source/)).toBeInTheDocument();
  });

  it("shows edit-source breadcrumb header in edit-source step", async () => {
    renderEditForm("view,edit,edit-source");

    expect(
      await screen.findByRole("link", { name: `Edit ${profile.title}` }),
    ).toBeInTheDocument();
    expect(screen.getByText(/\/ Edit source/)).toBeInTheDocument();
  });

  it("breadcrumb link navigates back from source step", async () => {
    renderEditForm("view,edit,add-source");

    await user.click(
      await screen.findByRole("link", { name: `Edit ${profile.title}` }),
    );

    expect(screen.getByTestId("location")).not.toHaveTextContent("add-source");
  });

  it("clicking Add source navigates to add-source step", async () => {
    renderEditForm("view,edit");

    await screen.findByRole("button", { name: /save changes/i });
    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("add-source");
  });

  it("submitting source form in add-source step appends source to the list", async () => {
    renderEditForm("view,edit,add-source");

    await user.type(
      await screen.findByRole("textbox", { name: /source name/i }),
      "my-new-source",
    );
    await user.type(
      screen.getByRole("textbox", { name: /deb line/i }),
      "deb http://example.com focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(
      await screen.findByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("my-new-source")).toBeInTheDocument();
  });
});
