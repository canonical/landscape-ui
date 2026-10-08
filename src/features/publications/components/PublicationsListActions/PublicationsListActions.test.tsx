import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationsListActions from "./PublicationsListActions";
import { OperationProvider } from "@/features/operations";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("PublicationsListActions", () => {
  const [publication, inProgressPublication] = publications;
  const publicationLabel = publication.displayName;

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("shows all dropdown actions", async () => {
    const user = userEvent.setup();
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

  it("disables republish button while publishing if canceling LROs is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const label = inProgressPublication.displayName;
    const user = userEvent.setup();

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
      screen.getByRole("menuitem", { name: `Publishing "${label}"` }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.queryByRole("menuitem", { name: `Republish "${label}"` }),
    ).not.toBeInTheDocument();
  });

  it("confirms canceling an ongoing publication before republishing", async () => {
    const user = userEvent.setup();
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

    await user.click(
      screen.getByRole("menuitem", { name: `Republish "${label}"` }),
    );

    expect(
      screen.getByRole("heading", {
        name: `${label} is already being published`,
      }),
    ).toBeInTheDocument();
  });

  it("opens republish modal from menu", async () => {
    const user = userEvent.setup();
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
    const user = userEvent.setup();
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
