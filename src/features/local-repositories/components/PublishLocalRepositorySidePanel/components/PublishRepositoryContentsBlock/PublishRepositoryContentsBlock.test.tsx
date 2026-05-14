import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryContentsBlock from "./PublishRepositoryContentsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("PublishRepositoryContentsBlock", () => {
  it("renders contents block title", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[0]} />,
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("renders distribution and component labels", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[0]} />,
    );

    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Component")).toBeInTheDocument();
  });

  it("displays distribution value from repository", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[0]} />,
    );

    expect(screen.getByText("distribution 1")).toBeInTheDocument();
  });

  it("displays component value from repository", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[0]} />,
    );

    expect(screen.getByText("component 1")).toBeInTheDocument();
  });

  it("displays different repository data correctly", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[1]} />,
    );

    expect(screen.getByText("distribution 2")).toBeInTheDocument();
    expect(screen.getByText("component 2")).toBeInTheDocument();
  });
});
