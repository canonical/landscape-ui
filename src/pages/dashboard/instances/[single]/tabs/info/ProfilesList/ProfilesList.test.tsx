import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Profile } from "@/types/Profile";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import ProfilesList from "./ProfilesList";

const profiles: Profile[] = [
  { id: 1, name: "profile-1", title: "Profile One", type: "package" },
  { id: 2, name: "profile-2", title: "Profile Two", type: "usg" },
];

const instanceWithProfiles = { ...ubuntuInstance, profiles };

describe("ProfilesList", () => {
  const user = userEvent.setup();

  it("renders profiles table with all profiles", () => {
    renderWithProviders(<ProfilesList instance={instanceWithProfiles} />);

    expect(screen.getByText("Profile One")).toBeInTheDocument();
    expect(screen.getByText("Profile Two")).toBeInTheDocument();
  });

  it("has a search box", () => {
    renderWithProviders(<ProfilesList instance={instanceWithProfiles} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("filters profiles by search text", async () => {
    renderWithProviders(<ProfilesList instance={instanceWithProfiles} />);

    await user.type(screen.getByRole("searchbox"), "Profile One");
    await user.keyboard("{Enter}");

    expect(screen.getAllByText("Profile One").length).toBeGreaterThan(0);
    expect(screen.queryByText("Profile Two")).not.toBeInTheDocument();
  });

  it("renders empty list when instance has no profiles", () => {
    const instanceNoProfiles = { ...ubuntuInstance, profiles: [] };
    renderWithProviders(<ProfilesList instance={instanceNoProfiles} />);

    expect(screen.queryByText("Profile One")).not.toBeInTheDocument();
  });
});
