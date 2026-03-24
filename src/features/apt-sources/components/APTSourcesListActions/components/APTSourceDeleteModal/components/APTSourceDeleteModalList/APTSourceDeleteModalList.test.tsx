import { screen } from "@testing-library/react";
import { describe, it, expect, vi, assert } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { aptSources } from "@/tests/mocks/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { expectLoadingState } from "@/tests/helpers";
import APTSourceDeleteModal from "../../APTSourceDeleteModal";

const aptSourceWithProfiles = aptSources.find(
  ({ profiles }) => profiles.length,
);
assert(aptSourceWithProfiles);

const props = {
  aptSource: aptSourceWithProfiles,
  close: vi.fn(),
  opened: true,
};

describe("APTSourceDeleteModalList", () => {
  it("shows loading state initially", async () => {
    renderWithProviders(<APTSourceDeleteModal {...props} />);
    await expectLoadingState();
  });

  it("renders table with profiles after loading", async () => {
    renderWithProviders(<APTSourceDeleteModal {...props} />);

    const expectedProfiles = repositoryProfiles.filter(({ name }) =>
      aptSourceWithProfiles.profiles.includes(name),
    );
    const [firstProfile] = expectedProfiles;
    assert(firstProfile);

    expect(await screen.findByText(firstProfile.title)).toBeInTheDocument();
    expect(screen.getByText("Repository profile")).toBeInTheDocument();
  });

  it("shows error state when the request fails", async () => {
    setEndpointStatus({ status: "error", path: "repositoryprofiles" });

    renderWithProviders(<APTSourceDeleteModal {...props} />);

    await expectLoadingState();

    expect(await screen.findByText(/could not be loaded/i)).toBeInTheDocument();
  });
});
