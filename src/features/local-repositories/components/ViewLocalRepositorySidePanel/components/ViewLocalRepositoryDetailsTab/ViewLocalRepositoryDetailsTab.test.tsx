import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewLocalRepositoryDetailsTab from "./ViewLocalRepositoryDetailsTab";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { succeededOperation } from "@/tests/mocks/operations";
import type { Local } from "@canonical/landscape-openapi";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";

const [repository] = repositories;

describe("ViewLocalRepositoryDetailsTab", () => {
  it("renders details block with repository information", () => {
    const { container } = renderWithProviders(
      <ViewLocalRepositoryDetailsTab
        repository={repository}
        operationMetadata={succeededOperation.metadata}
      />,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();

    expect(container).toHaveInfoItem("Name", repository.displayName);
    expect(container).toHaveInfoItem("Status", "Packages imported");
    expect(container).toHaveInfoItem(
      "Last import",
      moment(repository.lastImportTime).format(DISPLAY_DATE_TIME_FORMAT),
    );
    expect(container).toHaveInfoItem("Description", NO_DATA_TEXT);
    expect(container).toHaveInfoItem(
      "Default distribution",
      repository.defaultDistribution,
    );
    expect(container).toHaveInfoItem(
      "Default component",
      repository.defaultComponent,
    );
  });

  it("renders description when present and fallback for last import", () => {
    const noImportRepository = (repositories as Local[]).find(
      (repo) => !repo.lastImportTime,
    );
    assert(
      noImportRepository,
      "Need a mock repository with no last import time",
    );
    assert(
      noImportRepository.comment,
      "Need a mock repository with a description",
    );

    const { container } = renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={noImportRepository} />,
    );

    expect(container).toHaveInfoItem("Last import", NO_DATA_TEXT);
    expect(container).toHaveInfoItem("Description", noImportRepository.comment);
  });

  it("renders used in block", async () => {
    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repository} />,
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
