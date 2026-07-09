import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationsListActions from "./PublicationsListActions";
import { OperationProvider } from "@/features/operations";

describe("PublicationsListActions", () => {
  const user = userEvent.setup();
  const [publication, inProgressPublication] = publications;
  const publicationLabel = publication.displayName;

  it("shows all dropdown actions", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", {
        name: `${publicationLabel} publication actions`,
      }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: `View details of "${publicationLabel}"`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Republish "${publicationLabel}"`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Remove "${publicationLabel}"`,
      }),
    ).toBeInTheDocument();
  });

  it("disables republish button while publishing", async () => {
    const label = inProgressPublication.displayName;
    renderWithProviders(
      <OperationProvider operationNames={["operations/pppp-gggg-ssss"]}>
        <PublicationsListActions publication={inProgressPublication} />
      </OperationProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: `${label} publication actions`,
      }),
    );

    expect(
      screen.queryByRole("menuitem", { name: `Republish "${label}"` }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: `Publishing "${label}"` }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("opens republish modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", {
        name: `${publicationLabel} publication actions`,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: `Republish "${publicationLabel}"`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", {
        name: `${publicationLabel} publication actions`,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: `Remove "${publicationLabel}"`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: `Remove ${publicationLabel}` }),
    ).toBeInTheDocument();
  });
});
