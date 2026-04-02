import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileTypes } from "../../helpers";
import RemoveProfileModal from "./RemoveProfileModal";
import useNotify from "@/hooks/useNotify";
import useDebug from "@/hooks/useDebug";
import { useRemoveProfile } from "../../api/useRemoveProfile";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("../../api/useRemoveProfile", () => ({
  useRemoveProfile: vi.fn(),
}));

vi.mock("@/hooks/useNotify", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useDebug", () => ({
  default: vi.fn(),
}));

const mockUseNotify = vi.mocked(useNotify);
const mockUseDebug = vi.mocked(useDebug);
const mockUseRemoveProfile = vi.mocked(useRemoveProfile);

const [baseProfile] = profiles;

describe("RemoveProfileModal", () => {
  const notifySuccess = vi.fn();
  const debug = vi.fn();
  const removeProfile = vi.fn();
  const closeModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseNotify.mockReturnValue({
      notify: { success: notifySuccess },
    } as unknown as ReturnType<typeof useNotify>);

    mockUseDebug.mockReturnValue(debug);

    mockUseRemoveProfile.mockReturnValue({
      removeProfile,
      isRemovingProfile: false,
    });
  });

  it("submits archive and shows success notification", async () => {
    removeProfile.mockResolvedValue(undefined);

    render(
      <RemoveProfileModal
        profile={baseProfile}
        type={ProfileTypes.script}
        opened
        closeModal={closeModal}
      />,
    );

    expect(screen.getByText("Archive script profile")).toBeInTheDocument();
    expect(screen.getByText("archive Profile One")).toBeInTheDocument();
    await userEvent.type(screen.getByRole("textbox"), "archive Profile One");
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));

    expect(removeProfile).toHaveBeenCalledWith({
      id: baseProfile.id,
      name: baseProfile.name,
    });
    expect(notifySuccess).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });

  it("submits remove and shows success notification", async () => {
    removeProfile.mockResolvedValue(undefined);

    render(
      <RemoveProfileModal
        profile={baseProfile}
        type={ProfileTypes.repository}
        opened
        closeModal={closeModal}
      />,
    );

    expect(screen.getByText("Remove repository profile")).toBeInTheDocument();
    expect(screen.getByText("remove Profile One")).toBeInTheDocument();
    await userEvent.type(screen.getByRole("textbox"), "remove Profile One");
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(removeProfile).toHaveBeenCalledWith({
      id: baseProfile.id,
      name: baseProfile.name,
    });
    expect(notifySuccess).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });

  it("calls debug on failure and still closes modal", async () => {
    const error = new Error("request failed");
    removeProfile.mockRejectedValue(error);

    render(
      <RemoveProfileModal
        profile={baseProfile}
        type={ProfileTypes.package}
        opened
        closeModal={closeModal}
      />,
    );

    await userEvent.type(screen.getByRole("textbox"), "remove Profile One");
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(closeModal).toHaveBeenCalled();
    expect(debug).toHaveBeenCalledWith(error);
  });

  it("disables confirm button while request is pending", () => {
    mockUseRemoveProfile.mockReturnValue({
      removeProfile,
      isRemovingProfile: true,
    });

    render(
      <RemoveProfileModal
        profile={baseProfile}
        type={ProfileTypes.script}
        opened
        closeModal={closeModal}
      />,
    );

    const loadingButton = screen.getByRole("button", {
      name: "Waiting for action to complete",
    });
    expect(loadingButton).toHaveAttribute("aria-disabled", "true");
    expect(loadingButton).toHaveClass("is-disabled");
  });
});
