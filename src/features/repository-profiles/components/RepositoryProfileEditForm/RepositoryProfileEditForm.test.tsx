import usePageParams from "@/hooks/usePageParams";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import RepositoryProfileEditForm from "./RepositoryProfileEditForm";

const [profile] = repositoryProfiles;

// Mirrors real app behavior: only mount when name param is set
const NameGuard = () => {
  const { name } = usePageParams();
  if (!name) return null;
  return (
    <Suspense fallback={null}>
      <RepositoryProfileEditForm />
    </Suspense>
  );
};

const renderEditForm = (sidePath = "view,edit") =>
  renderWithProviders(
    <NameGuard />,
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
      <NameGuard />,
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

  it("clears sidePath and name URL params on close button click", async () => {
    renderEditForm();

    await screen.findByRole("heading", { name: `Edit ${profile.title}` });

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByRole("heading", { name: `Edit ${profile.title}` }),
    ).not.toBeInTheDocument();
  });
});
