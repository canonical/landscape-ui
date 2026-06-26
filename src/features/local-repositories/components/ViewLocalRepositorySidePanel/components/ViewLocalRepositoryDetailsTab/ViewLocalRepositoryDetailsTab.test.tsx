import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewLocalRepositoryDetailsTab from "./ViewLocalRepositoryDetailsTab";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { succeededOperation } from "@/tests/mocks/operations";
import type { Local } from "@canonical/landscape-openapi";

describe("ViewLocalRepositoryDetailsTab", () => {
  it("renders details block with repository information", () => {
    const { container } = renderWithProviders(
      <ViewLocalRepositoryDetailsTab
        repository={repositories[0]}
        operationMetadata={succeededOperation.metadata}
      />,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();

    expect(container).toHaveInfoItem("Name", "Local with no description");
    expect(container).toHaveInfoItem("Status", "Packages imported");
    expect(container).toHaveInfoItem("Last import", "Jun 01, 2024, 09:00");
    expect(container).toHaveInfoItem("Description", NO_DATA_TEXT);
    expect(container).toHaveInfoItem("Default distribution", "noble");
    expect(container).toHaveInfoItem("Default component", "main");
  });

  it("renders description when present and fallback for last import", () => {
    const repository = (repositories as Local[]).find(
      (repo) => !repo.lastImportTime,
    );
    assert(repository, "Need a mock repository with no last import time");

    const { container } = renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repository} />,
    );

    expect(container).toHaveInfoItem("Last import", NO_DATA_TEXT);
    expect(container).toHaveInfoItem(
      "Description",
      "local with no package import attempts",
    );
  });

  it("renders used in block", async () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repositories[0]} />,
    );

    expect(screen.getByText("Used in")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: /Publication/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Date published/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
