import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ViewLocalRepositoryDetailsTab from "./ViewLocalRepositoryDetailsTab";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { succeededOperation } from "@/tests/mocks/operations";
import type { Local } from "@canonical/landscape-openapi";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";

const [repository] = repositories;

vi.mock("@/hooks/useAuth");

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: () => true,
  hasAccounts: true,
};

describe("ViewLocalRepositoryDetailsTab", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authContextValues);
  });

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

  it("hides the Last import item when the feature flag is disabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authContextValues,
      isFeatureEnabled: () => false,
    });

    renderWithProviders(
      <ViewLocalRepositoryDetailsTab repository={repository} />,
    );

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.queryByText("Last import")).not.toBeInTheDocument();
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
