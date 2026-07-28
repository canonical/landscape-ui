/* eslint-disable @typescript-eslint/no-magic-numbers */
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewRepositoryPackagesTab from "./ViewRepositoryPackagesTab";
import { repositories, packages } from "@/tests/mocks/localRepositories";

describe("ViewRepositoryPackagesTab", () => {
  it("renders table with correct header after loading", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab
        repositoryName={repositories[0].name}
        isImporting={false}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });

  it("renders in progress notification while importing packages", async () => {
    renderWithProviders(
      <ViewRepositoryPackagesTab
        repositoryName={repositories[0].name}
        isImporting={true}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Packages are currently being imported.",
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });

  it("navigates to the next and previous page", async () => {
    assert(packages[0]);
    assert(packages[9]);
    assert(packages[10]);
    assert(packages[19]);

    const user = userEvent.setup();
    renderWithProviders(
      <ViewRepositoryPackagesTab
        repositoryName={repositories[0].name}
        isImporting={false}
      />,
    );

    expect(await screen.findByText(packages[0])).toBeInTheDocument();
    expect(await screen.findByText(packages[9])).toBeInTheDocument();
    expect(screen.queryByText(packages[10])).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(await screen.findByText(packages[10])).toBeInTheDocument();
    expect(await screen.findByText(packages[19])).toBeInTheDocument();
    expect(screen.queryByText(packages[0])).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous page" }));

    expect(await screen.findByText(packages[0])).toBeInTheDocument();
    expect(screen.queryByText(packages[10])).not.toBeInTheDocument();
  });
});
