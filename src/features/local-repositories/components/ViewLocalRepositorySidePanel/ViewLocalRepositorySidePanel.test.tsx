import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import ViewLocalRepositorySidePanel from "./ViewLocalRepositorySidePanel";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { repositories } from "@/tests/mocks/localRepositories";
import type { Local } from "@canonical/landscape-openapi";

const [repository] = repositories;
const typedRepos = repositories as Local[];

const renderComponent = (localId: string = repository.localId) =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <ViewLocalRepositorySidePanel />
    </Suspense>,
    undefined,
    `?sidePath=view&name=${localId}`,
  );

describe("ViewLocalRepositorySidePanel", () => {
  it("renders header and both tabs", async () => {
    renderComponent();

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: repository.displayName }),
    ).toBeInTheDocument();
    expect(screen.getByText("General details")).toBeInTheDocument();
    expect(screen.getByText("Packages")).toBeInTheDocument();
  });

  it("renders action buttons in both tabs", async () => {
    const user = userEvent.setup();
    renderComponent();

    const actionsButton = await screen.findByRole("button", {
      name: /actions/i,
    });

    expect(actionsButton).toBeInTheDocument();

    await user.click(
      within(screen.getByRole("navigation")).getByText(/packages/i),
    );

    expect(actionsButton).toBeInTheDocument();
  });

  it("defaults to details tab and changes to packages tab when clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const detailsTab = await screen.findByText(/general details/i);
    const packagesTab = within(screen.getByRole("navigation")).getByText(
      /packages/i,
    );

    expect(detailsTab).toHaveAttribute("aria-selected", "true");

    await user.click(packagesTab);

    expect(packagesTab).toHaveAttribute("aria-selected", "true");
    expect(detailsTab).toHaveAttribute("aria-selected", "false");
  });

  it("renders failed import notification", async () => {
    const failedRepository = typedRepos.find(({ lastOperation }) =>
      lastOperation?.includes("ffff-llll-dddd"),
    );
    assert(failedRepository, "Missing mock repository with a failed operation");

    renderComponent(failedRepository.localId ?? "");

    expect(
      await screen.findByRole("heading", { name: "Package import failed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your last package import was not completed successfully.",
      ),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "View logs" })).toHaveLength(
      2,
    );
  });

  it("does not render notification if no operation exists", async () => {
    const repositoryWithoutOperation = typedRepos.find(
      ({ lastOperation }) => !lastOperation,
    );
    assert(
      repositoryWithoutOperation,
      "Missing mock repository without an operation",
    );

    renderComponent(repositoryWithoutOperation.localId ?? "");

    expect(
      await screen.findByRole("heading", {
        name: repositoryWithoutOperation.displayName,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Package import failed" }),
    ).not.toBeInTheDocument();
  });
});
