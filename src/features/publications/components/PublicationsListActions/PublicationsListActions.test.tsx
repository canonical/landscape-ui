import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationsListActions from "./PublicationsListActions";

describe("PublicationsListActions", () => {
  const user = userEvent.setup();
  const [publication] = publications;
  const publicationLabel = publication.displayName;

  it("shows all dropdown actions", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publicationLabel} actions` }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: `View details of "${publicationLabel}" publication`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Republish "${publicationLabel}" publication`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Remove "${publicationLabel}" publication`,
      }),
    ).toBeInTheDocument();
  });

  it("opens republish modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publicationLabel} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", {
        name: `Republish "${publicationLabel}" publication`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publicationLabel} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", {
        name: `Remove "${publicationLabel}" publication`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: `Remove ${publicationLabel}` }),
    ).toBeInTheDocument();
  });
});
