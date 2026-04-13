import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationsListActions from "./PublicationsListActions";

describe("PublicationsListActions", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  it("shows all dropdown actions", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publication.name} actions` }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: `View details of "${publication.name}" publication`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Republish "${publication.name}" publication`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Remove "${publication.name}" publication`,
      }),
    ).toBeInTheDocument();
  });

  it("opens details side panel from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publication.name} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", {
        name: `View details of "${publication.name}" publication`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: publication.name }),
    ).toBeInTheDocument();
  });

  it("opens republish modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publication.name} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", {
        name: `Republish "${publication.name}" publication`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publication.name}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal from menu", async () => {
    renderWithProviders(<PublicationsListActions publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `${publication.name} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", {
        name: `Remove "${publication.name}" publication`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Remove publication" }),
    ).toBeInTheDocument();
  });
});
