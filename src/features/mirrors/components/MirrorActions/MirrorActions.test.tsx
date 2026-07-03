import { OperationProvider } from "@/context/operationStatus";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import MirrorActions from "./MirrorActions";
import { setEndpointStatus } from "@/tests/controllers/controller";

const [mirror] = mirrors;
const operationName = "operations/pppp-gggg-ssss";

const ComponentWithLocation = () => {
  const location = useLocation();
  return (
    <>
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />
      <div data-testid="location">{location.search}</div>
    </>
  );
};

describe("MirrorActions", () => {
  it("opens menu with mirror actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />,
    );

    await user.click(await screen.findByRole("button"));

    expect(
      screen.getByRole("menuitem", { name: "View details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Update" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Publish" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Remove" }),
    ).toBeInTheDocument();
  });

  it("disables update button while updating", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OperationProvider operationNames={[operationName]}>
        <MirrorActions
          mirrorDisplayName={mirror.displayName}
          mirrorName={mirror.name}
          operationName={operationName}
        />
      </OperationProvider>,
    );

    await user.click(await screen.findByRole("button"));

    expect(
      screen.queryByRole("menuitem", { name: "Update" }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole("menuitem", { name: "Updating" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("opens update modal when update is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />,
    );

    await user.click(await screen.findByRole("button"));
    await user.click(await screen.findByRole("menuitem", { name: "Update" }));

    expect(
      await screen.findByRole("heading", {
        name: `Update ${mirror.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens removal modal when remove is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />,
    );

    await user.click(await screen.findByRole("button"));
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));

    expect(
      await screen.findByRole("heading", {
        name: `Remove ${mirror.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens publish side panel when publish is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithLocation />);

    await user.click(await screen.findByRole("button"));
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("sidePath=publish");
    expect(location).toHaveTextContent(
      `name=${encodeURIComponent(mirror.name)}`,
    );
  });

  it("opens no publication targets modal when there are no publication targets", async () => {
    setEndpointStatus({ path: "publicationTargets", status: "empty" });

    const user = userEvent.setup();
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />,
    );

    await user.click(await screen.findByRole("button"));
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(
      await screen.findByRole("heading", {
        name: "No publication targets have been added",
      }),
    ).toBeInTheDocument();
  });
});
