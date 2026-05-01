import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import USGProfilesNotifications from "./USGProfilesNotifications";
import { useGetOverLimitUsgProfiles } from "../../api";
import { useGetActivities } from "@/features/activities";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import type * as actualModule from "react-router";

vi.mock("../../api", () => ({
  useGetOverLimitUsgProfiles: vi.fn(),
}));

vi.mock("@/features/activities", () => ({
  useGetActivities: vi.fn(),
}));

const downloadAudit = vi.fn();
vi.mock("../../hooks/useUsgProfileDownloadAudit", () => ({
  useUsgProfileDownloadAudit: () => downloadAudit,
}));

const pathname = "current/path/";
const navigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof actualModule>("react-router");

  return {
    ...actual,
    useLocation: () => ({ pathname }),
    useNavigate: () => navigate,
  };
});

const openProfileSidePanel = vi.fn();
vi.mock("@/features/profiles", () => ({
  useOpenProfileSidePanel: () => openProfileSidePanel,
}));

const mockUseGetOverLimitUsgProfiles = vi.mocked(useGetOverLimitUsgProfiles);
const mockUseGetActivities = vi.mocked(useGetActivities);

const [profileA, profileB] = usgProfiles;

describe("USGProfilesNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders retention notification when visible", () => {
    mockUseGetOverLimitUsgProfiles.mockReturnValue({
      overLimitUsgProfiles: [],
    } as unknown as ReturnType<typeof useGetOverLimitUsgProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <USGProfilesNotifications
        isRetentionNotificationVisible
        hideRetentionNotification={vi.fn()}
      />,
    );

    expect(screen.getByText("Audit retention policy:")).toBeInTheDocument();
  });

  it("renders single-profile notifications", async () => {
    mockUseGetOverLimitUsgProfiles.mockReturnValue({
      overLimitUsgProfiles: [profileA],
    } as unknown as ReturnType<typeof useGetOverLimitUsgProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [{ result_text: "result" }],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <USGProfilesNotifications
        isRetentionNotificationVisible={false}
        hideRetentionNotification={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("Audit retention policy:"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Your audit is ready for download:",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your audit has been successfully generated/),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Download audit" }),
    );
    expect(downloadAudit).toHaveBeenCalledWith("result");

    expect(
      screen.getByRole("heading", {
        name: "Profile exceeded associated instance limit:",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(profileA.title)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(openProfileSidePanel).toHaveBeenCalledWith(profileA, "edit");
  });

  it("renders multi-profile notifications", async () => {
    mockUseGetOverLimitUsgProfiles.mockReturnValue({
      overLimitUsgProfiles: [profileA, profileB],
    } as unknown as ReturnType<typeof useGetOverLimitUsgProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [{ result_text: "result-a" }, { result_text: "result-b" }],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <USGProfilesNotifications
        isRetentionNotificationVisible={false}
        hideRetentionNotification={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Your audits are ready for download:",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Several of your audits/)).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Download audits" }),
    );
    expect(downloadAudit).toHaveBeenCalledTimes(2);

    expect(
      screen.getByRole("heading", {
        name: "Profiles exceeded associated instance limit:",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Some of your USG profiles/)).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "View profiles" }),
    );
    expect(navigate).toHaveBeenCalledWith({
      pathname,
      search: "?status=over-limit",
    });
  });
});
