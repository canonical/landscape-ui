import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PublishRepositoryExistingForm from "./PublishRepositoryExistingForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { publications } from "@/tests/mocks/publications";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as publicationsApi from "@/features/publications";

const localRepositoriesPublications = publications.filter(({ source }) =>
  source.startsWith("locals/"),
);

describe("PublishRepositoryExistingForm", () => {
  const mockPublishPublication = vi.fn();

  beforeEach(() => {
    mockPublishPublication.mockResolvedValue({});
    vi.spyOn(publicationsApi, "usePublishPublication").mockReturnValue({
      publishPublication: mockPublishPublication,
      isPublishingPublication: false,
    });
  });

  it("renders form with publication selector", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByLabelText(/^publication name$/i)).toBeInTheDocument();
  });

  it("renders read-only publication target field", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByText("Publication target")).toBeInTheDocument();
  });

  it("renders read-only signing GPG key field", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByText("Signing GPG key")).toBeInTheDocument();
  });

  it("displays available publications", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByText("noble publication")).toBeInTheDocument();
  });

  it("renders contents block", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("renders settings checkboxes", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByLabelText(/hash based indexing/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/automatic installation/i),
    ).toBeInTheDocument();
  });

  it("renders publish button", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    expect(
      screen.getByRole("button", { name: /publish/i }),
    ).toBeInTheDocument();
  });

  it("submits form with selected publication", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
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

    expect(mockPublishPublication).toHaveBeenCalled();
  });

  it("displays publication details when selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={localRepositoriesPublications}
      />,
    );

    const publicationSelect = screen.getByLabelText(/^publication name$/i);
    await user.selectOptions(
      publicationSelect,
      localRepositoriesPublications[0]?.name ?? "",
    );

    expect(
      screen.getByText(
        "publicationTargets/bbbbbbbb-0000-0000-0000-000000000002",
      ),
    ).toBeInTheDocument();
  });

  it("renders with empty publications list", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        repository={repositories[0]}
        publications={[]}
      />,
    );

    expect(screen.getByLabelText(/^publication name$/i)).toBeInTheDocument();
  });
});
