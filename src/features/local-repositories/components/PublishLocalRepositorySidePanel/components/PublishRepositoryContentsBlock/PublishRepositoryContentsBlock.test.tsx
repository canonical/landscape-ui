import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryContentsBlock from "./PublishRepositoryContentsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("PublishRepositoryContentsBlock", () => {
  it("renders contents block", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repositories[0]} />,
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();

    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("distribution 1")).toBeInTheDocument();
    expect(screen.getByText("Component")).toBeInTheDocument();
    expect(screen.getByText("component 1")).toBeInTheDocument();
  });
});
