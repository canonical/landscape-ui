import { renderWithProviders } from "@/tests/render";
import LoadingState from "@/components/layout/LoadingState";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import MirrorActions from "./MirrorActions";
import usePageParams from "@/hooks/usePageParams/usePageParams";

describe("MirrorActions", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  const TestComponent = () => {
    const { lastSidePathSegment, name } = usePageParams();

    return (
      <Suspense fallback={<LoadingState />}>
        <MirrorActions
          mirrorDisplayName="Mirror display name"
          mirrorName="mirrors/name"
        />
        <div data-testid="sidePath">{lastSidePathSegment}</div>
        <div data-testid="name">{name}</div>
      </Suspense>
    );
  };

  const openActionsMenu = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(
      await screen.findByRole("button", {
        name: "Mirror display name mirror actions",
      }),
    );
  };

  it("opens the update modal when update is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Update" }));

    expect(
      screen.getByRole("heading", { name: "Update Mirror display name" }),
    ).toBeInTheDocument();
  });

  it("opens the remove modal when remove is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));

    expect(
      screen.getByRole("heading", { name: "Remove Mirror display name" }),
    ).toBeInTheDocument();
  });

  it("opens no publication targets modal when publish is clicked without targets", async () => {
    const user = userEvent.setup();

    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(
      screen.getByRole("heading", {
        name: "No publication targets have been added",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("sidePath")).not.toHaveTextContent("publish");
  });

  it("sets publish side panel when publish is clicked with publication targets", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(screen.getByTestId("sidePath")).toHaveTextContent("publish");
    expect(screen.getByTestId("name")).toHaveTextContent("mirrors/name");
  });

  it("sets view side panel when view details is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(
      await screen.findByRole("menuitem", { name: "View details" }),
    );

    expect(screen.getByTestId("sidePath")).toHaveTextContent("view");
    expect(screen.getByTestId("name")).toHaveTextContent("mirrors/name");
  });

  it("sets edit side panel when edit is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(screen.getByTestId("sidePath")).toHaveTextContent("edit");
    expect(screen.getByTestId("name")).toHaveTextContent("mirrors/name");
  });
});
