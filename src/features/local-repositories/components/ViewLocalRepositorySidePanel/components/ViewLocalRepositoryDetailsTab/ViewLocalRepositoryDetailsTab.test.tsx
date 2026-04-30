import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewLocalRepositoryDetailsTab from "./ViewLocalRepositoryDetailsTab";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("ViewLocalRepositoryDetailsTab", () => {
  it("renders details block with repository information", () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("repo 1")).toBeInTheDocument();
    expect(screen.getByText("distribution 1")).toBeInTheDocument();
    expect(screen.getByText("component 1")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[1]} />,
    );

    expect(screen.getByText("repo 2 description")).toBeInTheDocument();
  });

  it("renders used in block", () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect(screen.getByText("Used in")).toBeInTheDocument();
  });

  it("renders loading state while fetching publications", () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders publications list when loaded", async () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect((await screen.findAllByRole("link")).length).toBeGreaterThan(0);
  });

  it("displays all detail fields", () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Default distribution")).toBeInTheDocument();
    expect(screen.getByText("Default component")).toBeInTheDocument();
  });
});
