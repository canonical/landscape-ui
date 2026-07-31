import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewLocalRepositoryDetailsTab from "./ViewLocalRepositoryDetailsTab";
import { repositories } from "@/tests/mocks/localRepositories";
import { features } from "@/tests/mocks/features";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { succeededOperation } from "@/tests/mocks/operations";
import type { Local } from "@canonical/landscape-openapi";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import { http, HttpResponse } from "msw";

const [repository] = repositories;

describe("ViewLocalRepositoryDetailsTab", () => {
  it("renders details block with repository information", async () => {
    const { container } = renderWithProviders(
      <ViewLocalRepositoryDetailsTab
        repository={repository}
        operationMetadata={succeededOperation.metadata}
      />,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();

    expect(container).toHaveInfoItem("Name", repository.displayName);
    expect(container).toHaveInfoItem("Status", "Packages imported");
    expect(await screen.findByText("Last import")).toBeInTheDocument();
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

  it("hides the Last import item when the feature flag is disabled", async () => {
    server.use(
      http.get(`${API_URL}features`, () =>
        HttpResponse.json(
          generatePaginatedResponse({
            data: features.map((feature) =>
              feature.key === "local-repository-last-import"
                ? { ...feature, enabled: false }
                : feature,
            ),
            offset: 0,
            limit: 20,
          }),
        ),
      ),
    );

    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repository} />,
    );

    expect(await screen.findByText("Description")).toBeInTheDocument();
    expect(screen.queryByText("Last import")).not.toBeInTheDocument();
  });

  it("renders description when present and fallback for last import", async () => {
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

    expect(await screen.findByText("Last import")).toBeInTheDocument();
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
