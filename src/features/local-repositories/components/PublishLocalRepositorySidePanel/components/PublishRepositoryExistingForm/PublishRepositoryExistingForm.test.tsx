import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryExistingForm from "./PublishRepositoryExistingForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { publications } from "@/tests/mocks/publications";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@sentry/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const localRepositoriesPublications = publications.filter(({ source }) =>
  source.startsWith("locals/"),
);

const [repository] = repositories;
const [defaultPublication] = localRepositoriesPublications;
assert(
  defaultPublication,
  "No local repository publications found for testing",
);

describe("PublishRepositoryExistingForm", () => {
  it("renders form with all fields and buttons", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repository}
        publications={localRepositoriesPublications}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/publication name/i)).toHaveValue(
      defaultPublication.name,
    );
    expect(screen.getByText("Publication target")).toBeInTheDocument();
    expect(screen.getByText("Signing GPG key")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Contents" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Component")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Installs and upgrades")).toBeInTheDocument();
    expect(screen.getByLabelText(/hash based indexing/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish/i }),
    ).toBeInTheDocument();
  });

  it("submits form with selected publication", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repository}
        publications={localRepositoriesPublications}
      />,
    );

    const publicationSelect = screen.getByLabelText(/^publication name$/i);
    await user.selectOptions(
      publicationSelect,
      localRepositoriesPublications[0]?.name ?? "",
    );

    const submitButton = screen.getByRole("button", { name: /publish/i });
    await user.click(submitButton);

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).toBeInTheDocument();
  });

  it("displays publication details when selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repository}
        publications={localRepositoriesPublications}
      />,
    );

    const publicationSelect = screen.getByLabelText(/^publication name$/i);
    await user.selectOptions(publicationSelect, defaultPublication.name);

    expect(
      screen.getByText(
        "publicationTargets/bbbbbbbb-0000-0000-0000-000000000002",
      ),
    ).toBeInTheDocument();
  });

  it("throws error when no publications are available", () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>Selected publication not found</p>}>
        <PublishRepositoryExistingForm
          repository={repository}
          publications={[]}
        />
      </ErrorBoundary>,
    );
    expect(
      screen.getByText("Selected publication not found"),
    ).toBeInTheDocument();
  });

  it("shows an error notification when publishing a repository fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "publications", status: "error" });

    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repository}
        publications={localRepositoriesPublications}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: /publish repository/i,
    });
    await user.click(submitButton);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).not.toBeInTheDocument();
  });
});
