import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SecurityProfilesNotifications from "./SecurityProfilesNotifications";
import { useGetOverLimitSecurityProfiles } from "../../api";
import { useGetActivities } from "@/features/activities";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import type * as actualModule from "react-router";

vi.mock("../../api", () => ({
  useGetOverLimitSecurityProfiles: vi.fn(),
}));

vi.mock("@/features/activities", () => ({
  useGetActivities: vi.fn(),
}));

const downloadAudit = vi.fn();
vi.mock("../../hooks/useSecurityProfileDownloadAudit", () => ({
  useSecurityProfileDownloadAudit: () => downloadAudit,
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

const mockUseGetOverLimitSecurityProfiles = vi.mocked(
  useGetOverLimitSecurityProfiles,
);
const mockUseGetActivities = vi.mocked(useGetActivities);

const [profileA, profileB] = securityProfiles;

describe("SecurityProfilesNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders retention notification when visible", () => {
    mockUseGetOverLimitSecurityProfiles.mockReturnValue({
      overLimitSecurityProfiles: [],
    } as unknown as ReturnType<typeof useGetOverLimitSecurityProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <SecurityProfilesNotifications
        isRetentionNotificationVisible
        hideRetentionNotification={vi.fn()}
      />,
    );

    expect(screen.getByText("Audit retention policy:")).toBeInTheDocument();
  });

  it("renders single-profile notifications", async () => {
    mockUseGetOverLimitSecurityProfiles.mockReturnValue({
      overLimitSecurityProfiles: [profileA],
    } as unknown as ReturnType<typeof useGetOverLimitSecurityProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [{ result_text: "result" }],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <SecurityProfilesNotifications
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
    mockUseGetOverLimitSecurityProfiles.mockReturnValue({
      overLimitSecurityProfiles: [profileA, profileB],
    } as unknown as ReturnType<typeof useGetOverLimitSecurityProfiles>);
    mockUseGetActivities.mockReturnValue({
      activities: [{ result_text: "result-a" }, { result_text: "result-b" }],
    } as unknown as ReturnType<typeof useGetActivities>);

    renderWithProviders(
      <SecurityProfilesNotifications
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

    expect(
      screen.getByText(/Some of your security profiles/),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "View profiles" }),
    );
    expect(navigate).toHaveBeenCalledWith({
      pathname,
      search: "?status=over-limit",
    });
  });
});
