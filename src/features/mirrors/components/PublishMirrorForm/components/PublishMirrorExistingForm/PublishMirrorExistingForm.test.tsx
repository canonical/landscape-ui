import LoadingState from "@/components/layout/LoadingState";
import { Suspense } from "react";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import PublishMirrorExistingForm from "./PublishMirrorExistingForm";
import { screen } from "@testing-library/react";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { mirrors } from "@/tests/mocks/mirrors";
import { publications } from "@/tests/mocks/publications";
import { ErrorBoundary } from "@sentry/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import type { Publication } from "@canonical/landscape-openapi";
import { resetLroProgress } from "@/tests/server/handlers/operations";

const [mirror] = mirrors;
const typedPublications = publications as Publication[];

const ongoingPublication = typedPublications.find(
  ({ lastOperation }) => lastOperation === "operations/pppp-gggg-ssss",
);
assert(ongoingPublication, "Need mock publication with ongoing operation");

const renderForm = (
  publicationsProp = typedPublications,
  publicationTargetsProp = publicationTargets,
) => {
  renderWithProviders(
    <Suspense fallback={<LoadingState />}>
      <PublishMirrorExistingForm
        mirror={mirror}
        publications={publicationsProp}
        publicationTargets={publicationTargetsProp}
      />
    </Suspense>,
  );
};

describe("PublishMirrorExistingForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    resetLroProgress();
  });

  it("publishes to an existing publication", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText(
        `You have marked ${mirror.displayName} to be published`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "An activity has been queued to publish the selected publication to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("updates dependent fields when a different publication is selected", async () => {
    const user = userEvent.setup();
    const [firstPublication, secondPublication] = publications;

    const targetDisplayName = publicationTargets.find(
      ({ name }) => name === secondPublication.publicationTarget,
    )?.displayName;
    assert(
      targetDisplayName,
      "Need publication target mock for second publication",
    );

    renderForm();

    expect(screen.getByText(firstPublication.displayName)).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication" }),
      secondPublication.name,
    );

    expect(screen.getByRole("combobox", { name: "Publication" })).toHaveValue(
      secondPublication.name,
    );

    expect(screen.getByText(secondPublication.displayName)).toBeInTheDocument();
    expect(screen.getByText(targetDisplayName)).toBeInTheDocument();
  });

  it("falls back to the raw publication target when no matching target exists", () => {
    const [firstPublication] = publications;

    renderForm([firstPublication], []);

    expect(
      screen.getByText(firstPublication.publicationTarget),
    ).toBeInTheDocument();
  });

  it("throws on missing publication", async () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>Selected publication not found</p>}>
        <PublishMirrorExistingForm
          mirror={mirror}
          publications={[]}
          publicationTargets={publicationTargets}
        />
      </ErrorBoundary>,
    );

    expect(
      await screen.findByText("Selected publication not found"),
    ).toBeInTheDocument();
  });

  it("shows error if publishing fails", async () => {
    setEndpointStatus({ path: "publications", status: "error" });
    const user = userEvent.setup();
    renderForm();

    await user.click(
      await screen.findByRole("button", { name: "Publish mirror" }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("hides cancelation failure and publishes anyway", async () => {
    setEndpointStatus({ path: "operations/cancel", status: "error" });
    const user = userEvent.setup();

    renderForm([ongoingPublication]);

    await user.click(
      await screen.findByRole("button", { name: "Publish mirror" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${mirror.displayName} to be published`,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it("shows a loading help text while the operation status is being fetched", () => {
    renderForm([ongoingPublication]);

    expect(
      screen.getByText(/Checking publication status/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publish mirror" }),
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

    renderForm([unpublishedPublication]);

    expect(
      screen.queryByText(/Checking publication status/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publish mirror" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("shows warning if publication is already publishing", async () => {
    const user = userEvent.setup();

    renderForm([ongoingPublication]);

    expect(
      await screen.findByText(
        /the selected publication is already being published/i,
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/it will be canceled and restarted/i),
    ).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: "Publish mirror" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `You have marked ${mirror.displayName} to be published`,
      }),
    ).toBeInTheDocument();
  });

  it("shows error if the publication is already publishing and canceling LROs is disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const user = userEvent.setup();

    renderForm([ongoingPublication]);

    await user.click(
      await screen.findByRole("button", { name: "Publish mirror" }),
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
      screen.queryByText(
        `You have marked ${mirror.displayName} to be published`,
      ),
    ).not.toBeInTheDocument();
  });
});
