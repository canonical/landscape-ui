import LoadingState from "@/components/layout/LoadingState";
import { Suspense } from "react";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";
import PublishMirrorExistingForm from "./PublishMirrorExistingForm";
import { screen } from "@testing-library/react";
import { mirrors } from "@/tests/mocks/mirrors";
import { publications } from "@/tests/mocks/publications";
import { ErrorBoundary } from "@sentry/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const [mirror] = mirrors;

describe("PublishMirrorExistingForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("publishes to an existing publication", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <PublishMirrorExistingForm
          mirror={mirror}
          publications={publications}
        />
      </Suspense>,
    );

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

  it("throws on missing publication", async () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>Selected publication not found</p>}>
        <PublishMirrorExistingForm mirror={mirror} publications={[]} />
      </ErrorBoundary>,
    );

    expect(
      await screen.findByText("Selected publication not found"),
    ).toBeInTheDocument();
  });

  it("shows error if publishing fails", async () => {
    setEndpointStatus({ path: "publications", status: "error" });
    const user = userEvent.setup();
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <PublishMirrorExistingForm
          mirror={mirror}
          publications={publications}
        />
      </Suspense>,
    );

    await user.click(
      await screen.findByRole("button", { name: "Publish mirror" }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
