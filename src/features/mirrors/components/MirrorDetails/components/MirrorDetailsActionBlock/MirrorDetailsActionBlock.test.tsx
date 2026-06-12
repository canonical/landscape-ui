import LoadingState from "@/components/layout/LoadingState";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { Suspense } from "react";
import MirrorDetailsActionBlock from "./MirrorDetailsActionBlock";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { inProgressOperation } from "@/tests/mocks/operations";

const [mirror] = mirrors;

const ComponentWrapper = ({
  inProgress = false,
}: {
  readonly inProgress?: boolean;
}) => {
  const { search } = useLocation();

  return (
    <Suspense fallback={<LoadingState />}>
      <MirrorDetailsActionBlock
        displayName={mirror.displayName}
        operation={inProgress ? inProgressOperation : undefined}
      />
      <div data-testid="location">{search}</div>
    </Suspense>
  );
};

describe("MirrorDetailsActionBlock", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("opens UpdateMirrorModal if updateModal param is true", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=view&name=${mirror.name}&updateModal=true`,
    );

    expect(
      await screen.findByRole("heading", {
        name: `Update ${mirror.displayName}`,
      }),
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /Close/i });
    await user.click(closeButton);

    expect(
      screen.queryByRole("heading", {
        name: `Update ${mirror.displayName}`,
      }),
    ).not.toBeInTheDocument();
  });

  it("opens UpdateMirrorModal when Update button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=view&name=${mirror.name}`,
    );

    const updateButton = await screen.findByRole("button", {
      name: /Update/i,
    });
    await user.click(updateButton);

    expect(
      await screen.findByRole("heading", {
        name: `Update ${mirror.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("shows disabled Updating button with tooltip when operation is in progress", async () => {
    renderWithProviders(
      <ComponentWrapper inProgress />,
      undefined,
      `?sidePath=view&name=${mirror.name}`,
    );

    expect(
      await screen.findByRole("button", { name: /Updating/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("opens RemoveMirrorModal when Remove button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=view&name=${mirror.name}`,
    );

    const removeButton = await screen.findByRole("button", {
      name: /Remove/i,
    });
    await user.click(removeButton);

    expect(
      await screen.findByRole("heading", {
        name: `Remove ${mirror.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("navigates to publish side panel when Publish is clicked and targets exist", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=view&name=${mirror.name}`,
    );

    const publishButton = await screen.findByRole("button", {
      name: /Publish/i,
    });
    await user.click(publishButton);

    const location = screen.getByTestId("location");
    expect(location).toHaveTextContent("sidePath=view%2Cpublish");
    expect(location).toHaveTextContent(
      `name=${encodeURIComponent(mirror.name)}`,
    );
  });

  it("opens NoPublicationTargetsModal when Publish is clicked and no targets exist", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=view&name=${mirror.name}`,
    );

    const publishButton = await screen.findByRole("button", {
      name: /Publish/i,
    });
    await user.click(publishButton);

    expect(
      await screen.findByText(
        /In order to publish a mirror or a local repository/,
      ),
    ).toBeInTheDocument();
  });
});
