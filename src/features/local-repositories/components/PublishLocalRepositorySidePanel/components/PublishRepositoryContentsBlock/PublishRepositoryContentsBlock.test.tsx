import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryContentsBlock from "./PublishRepositoryContentsBlock";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

const [repository] = repositories;

describe("PublishRepositoryContentsBlock", () => {
  it("renders contents block", () => {
    renderWithProviders(
      <PublishRepositoryContentsBlock repository={repository} />,
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();

    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(
      screen.getByText(repository.defaultDistribution),
    ).toBeInTheDocument();
    expect(screen.getByText("Component")).toBeInTheDocument();
    expect(screen.getByText(repository.defaultComponent)).toBeInTheDocument();
  });
});
