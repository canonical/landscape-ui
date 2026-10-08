import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishRepositoryExistingForm from "./PublishRepositoryExistingForm";
import { repositories } from "@/tests/mocks/localRepositories";
import { publications } from "@/tests/mocks/publications";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@sentry/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import type { Publication } from "@canonical/landscape-openapi";
import { resetLroProgress } from "@/tests/server/handlers/operations";

const typedPublications = publications as Publication[];
const [repository] = repositories;

const donePublication = typedPublications.find(
  ({ lastOperation }) => lastOperation !== "operations/pppp-gggg-ssss",
);
const ongoingPublication = typedPublications.find(
  ({ lastOperation }) => lastOperation === "operations/pppp-gggg-ssss",
);
assert(
  donePublication && ongoingPublication,
  "Need local publication mocks with ongoing and completed operations",
);

const props = {
  repository: repository,
  publicationTargets: publicationTargets,
  publications: typedPublications,
};

describe("PublishRepositoryExistingForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    resetLroProgress();
  });

  it("renders form with all fields and buttons", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        {...props}
        publications={[ongoingPublication]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/publication name/i)).toHaveValue(
      ongoingPublication.name,
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
    renderWithProviders(<PublishRepositoryExistingForm {...props} />);

    const publicationSelect = screen.getByLabelText(/^publication name$/i);
    await user.selectOptions(publicationSelect, donePublication.name ?? "");

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
    const targetDisplayName = publicationTargets.find(
      ({ name }) => name === donePublication.publicationTarget,
    )?.displayName;
    assert(
      targetDisplayName,
      "Need publication target mock for done publication",
    );

    renderWithProviders(<PublishRepositoryExistingForm {...props} />);

    expect(
      screen.getByText(ongoingPublication.displayName),
    ).toBeInTheDocument();

    const publicationSelect = screen.getByLabelText(/^publication name$/i);
    await user.selectOptions(publicationSelect, donePublication.name ?? "");

    expect(screen.getByText(donePublication.displayName)).toBeInTheDocument();
    expect(screen.getByText(targetDisplayName)).toBeInTheDocument();
  });

  it("falls back to the raw publication target when no matching target exists", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm {...props} publicationTargets={[]} />,
    );

    expect(
      screen.getByText(donePublication.publicationTarget),
    ).toBeInTheDocument();
  });

  it("throws error when no publications are available", () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>Selected publication not found</p>}>
        <PublishRepositoryExistingForm {...props} publications={[]} />
      </ErrorBoundary>,
    );
    expect(
      screen.getByText("Selected publication not found"),
    ).toBeInTheDocument();
  });

  it("shows an error notification when publishing a repository fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "publications", status: "error" });

    renderWithProviders(<PublishRepositoryExistingForm {...props} />);

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

  it("hides cancelation failure and publishes anyway", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "operations/cancel", status: "error" });

    renderWithProviders(<PublishRepositoryExistingForm {...props} />);

    await user.click(
      await screen.findByRole("button", { name: "Publish repository" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it("shows a loading help text while the operation status is being fetched", () => {
    renderWithProviders(
      <PublishRepositoryExistingForm
        {...props}
        publications={[ongoingPublication]}
      />,
    );

    expect(
      screen.getByText(/Checking publication status/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish repository/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("does not show help text if the publication has no operation", () => {
    const unpublishedPublication = typedPublications.find(
      ({ lastOperation }) => !lastOperation,
    );
    assert(
      unpublishedPublication,
      "Need mock publication with no lastOperation",
    );

    renderWithProviders(
      <PublishRepositoryExistingForm
        {...props}
        publications={[unpublishedPublication]}
      />,
    );

    expect(
      screen.queryByText(/Checking publication status/i),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Publish repository" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("shows warning if the publication is already publishing", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PublishRepositoryExistingForm
        {...props}
        publications={[ongoingPublication]}
      />,
    );

    expect(
      await screen.findByText(
        /the selected publication is already being published/i,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/it will be canceled and restarted/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /publish repository/i }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).toBeInTheDocument();
  });

  it("shows error if the publication is already publishing and canceling LROs is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const user = userEvent.setup();

    renderWithProviders(
      <PublishRepositoryExistingForm
        {...props}
        publications={[ongoingPublication]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /publish repository/i }),
    );

    expect(
      await screen.findByText(
        /the selected publication is already being published/i,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /wait for this action to be completed to republish it/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: `You have marked ${repository.displayName} to be published`,
      }),
    ).not.toBeInTheDocument();
  });
});
