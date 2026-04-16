import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileTypes } from "../../helpers";
import RemoveProfileModal from "./RemoveProfileModal";
import useProfiles from "@/hooks/useProfiles";
import { profiles } from "@/tests/mocks/profiles";
import { renderWithProviders } from "@/tests/render";

vi.mock("@/hooks/useProfiles", () => ({
  default: vi.fn(),
}));

const mockUseProfiles = vi.mocked(useProfiles);

const [baseProfile] = profiles;

describe("RemoveProfileModal", () => {
  const removeProfile = vi.fn();
  const closeModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseProfiles.mockReturnValue({
      removeProfile,
      isRemovingProfile: false,
    } as unknown as ReturnType<typeof useProfiles>);
  });

  it("submits archive and shows success notification", async () => {
    renderWithProviders(
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

    expect(screen.getByText("Script profile archived")).toBeInTheDocument();
    expect(closeModal).toHaveBeenCalled();
  });

  it("submits remove and shows success notification", async () => {
    renderWithProviders(
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

    expect(screen.getByText("Repository profile removed")).toBeInTheDocument();
    expect(closeModal).toHaveBeenCalled();
  });

  it("calls debug on failure and still closes modal", async () => {
    const error = new Error("request failed");
    removeProfile.mockRejectedValue(error);

    renderWithProviders(
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
    expect(screen.getByText("request failed")).toBeInTheDocument();
  });

  it("disables confirm button while request is pending", () => {
    mockUseProfiles.mockReturnValue({
      removeProfile,
      isRemovingProfile: true,
    } as unknown as ReturnType<typeof useProfiles>);

    renderWithProviders(
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
