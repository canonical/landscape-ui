import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPackagesCount from "./LocalRepositoryPackagesCount";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

const repositoryName = repositories[0].name;

describe("LocalRepositoryPackagesCount", () => {
  it("renders loading state while fetching packages", () => {
    setEndpointStatus({
      status: "loading",
      path: "locals",
    });

    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositoryName} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows an exact count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "locals",
      response: {
        localPackages: ["package-1", "package-2", "package-3"],
        nextPageToken: undefined,
      },
    });

    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositoryName} />,
    );

    expect(await screen.findByText("3 packages")).toBeInTheDocument();
  });

  it("shows a limited count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "locals",
      response: {
        localPackages: ["package-1", "package-2", "package-3"],
        nextPageToken: "1",
      },
    });

    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositoryName} />,
    );

    expect(await screen.findByText("3+ packages")).toBeInTheDocument();
  });

  it("shows 0 packages", async () => {
    setEndpointStatus({
      status: "empty",
      path: "locals",
    });

    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositoryName} />,
    );

    expect(await screen.findByText("0 packages")).toBeInTheDocument();
  });

  it("shows no data fallback with error", async () => {
    setEndpointStatus({
      status: "error",
      path: "locals",
    });

    renderWithProviders(
      <LocalRepositoryPackagesCount repository={repositoryName} />,
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("shows no data fallback for empty name", async () => {
    renderWithProviders(<LocalRepositoryPackagesCount repository="" />);

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
