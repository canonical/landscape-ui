import { renderWithProviders } from "@/tests/render";
import LoadingState from "@/components/layout/LoadingState";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MirrorActions from "./MirrorActions";

const mockSetPageParams = vi.fn();

vi.mock("../UpdateMirrorModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Update modal is open</div> : null,
}));

vi.mock("../RemoveMirrorModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Remove modal is open</div> : null,
}));

vi.mock("@/features/publication-targets", () => ({
  NoPublicationTargetsModal: () => (
    <div>No publication targets modal is open</div>
  ),
}));

vi.mock("@/hooks/usePageParams", () => ({
  __esModule: true,
  default: () => ({
    setPageParams: mockSetPageParams,
    createPageParamsSetter: (params: Record<string, unknown>) => () =>
      mockSetPageParams(params),
  }),
}));

describe("MirrorActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setEndpointStatus("default");
  });

  const renderActions = () =>
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorActions
          mirrorDisplayName="Mirror display name"
          mirrorName="mirrors/name"
        />
      </Suspense>,
    );

  const openActionsMenu = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(await screen.findByRole("button", { name: "" }));
  };

  it("renders", () => {
    renderActions();
  });

  it("opens the update modal when update is clicked", async () => {
    const user = userEvent.setup();

    renderActions();

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Update" }));

    expect(screen.getByText("Update modal is open")).toBeInTheDocument();
  });

  it("opens the remove modal when remove is clicked", async () => {
    const user = userEvent.setup();

    renderActions();

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));

    expect(screen.getByText("Remove modal is open")).toBeInTheDocument();
  });

  it("opens no publication targets modal when publish is clicked without targets", async () => {
    const user = userEvent.setup();

    setEndpointStatus([
      { status: "empty", path: "publicationTargets" },
      { status: "empty", path: "publications" },
    ]);

    renderActions();

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(
      screen.getByText("No publication targets modal is open"),
    ).toBeInTheDocument();
    expect(mockSetPageParams).not.toHaveBeenCalledWith(
      expect.objectContaining({ sidePath: ["publish"] }),
    );
  });

  it("sets publish side panel when publish is clicked with publication targets", async () => {
    const user = userEvent.setup();

    renderActions();

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(mockSetPageParams).toHaveBeenCalledWith({
      sidePath: ["publish"],
      name: "mirrors/name",
    });
  });

  it("sets view side panel when view details is clicked", async () => {
    const user = userEvent.setup();

    renderActions();

    await openActionsMenu(user);
    await user.click(
      await screen.findByRole("menuitem", { name: "View details" }),
    );

    expect(mockSetPageParams).toHaveBeenCalledWith({
      sidePath: ["view"],
      name: "mirrors/name",
    });
  });

  it("sets edit side panel when edit is clicked", async () => {
    const user = userEvent.setup();

    renderActions();

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(mockSetPageParams).toHaveBeenCalledWith({
      sidePath: ["edit"],
      name: "mirrors/name",
    });
  });
});
