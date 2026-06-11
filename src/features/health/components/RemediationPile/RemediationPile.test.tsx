import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosResponse } from "axios";
import {
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Instance, InstanceHealth } from "@/types/Instance";
import { ubuntuInstance } from "@/tests/mocks/instance";
import useFleetHealthSummary from "../../hooks/useFleetHealthSummary";
import useFleetTopDetractors from "../../hooks/useFleetTopDetractors";
import useHealthAction from "../../hooks/useHealthAction";
import { useGetInstances } from "@/features/instances/api/useGetInstances";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  FleetHealthSummary,
  FleetTopDetractor,
  HealthFactor,
} from "../../types";
import RemediationPile from "./RemediationPile";

vi.mock("../../hooks/useFleetTopDetractors");
vi.mock("../../hooks/useFleetHealthSummary");
vi.mock("../../hooks/useHealthAction");
vi.mock("@/features/instances/api/useGetInstances");
vi.mock("@/hooks/useSidePanel");

// `useNotify` is exercised by the refresh-facts toast. We don't mock it so the
// notification context provided by `renderWithProviders` can render the toast
// and we can assert on it.

const setSidePanelContent = vi.fn();

const mutateAsync = vi.fn(async () =>
  ({ data: { activity_id: 99 } }) as AxiosResponse,
);

const mockSidePanel = (): void => {
  vi.mocked(useSidePanel).mockReturnValue({
    setSidePanelContent,
    closeSidePanel: vi.fn(),
    changeSidePanelSize: vi.fn(),
    changeSidePanelTitleLabel: vi.fn(),
    setSidePanelTitle: vi.fn(),
    setOnCloseOverride: vi.fn(),
  });
};

const factor = (
  rule_id: number,
  rule_key: string,
  description: string,
  points: number,
): HealthFactor => ({ rule_id, rule_key, description, points });

const F_CRITICAL = factor(1, "usn.critical", "Critical USN pending.", 100);
const F_HIGH = factor(2, "usn.high", "High USN pending.", 20);
const F_MEDIUM = factor(3, "usn.medium", "Medium USN pending.", 5);
const F_REBOOT = factor(5, "reboot_required", "Reboot required.", 10);
const F_OFFLINE = factor(6, "instance.offline", "Offline > 24h.", 20);

const instance = (
  id: number,
  title: string,
  factors: HealthFactor[],
  band: InstanceHealth["band"] = "critical",
): Instance => ({
  ...ubuntuInstance,
  id,
  title,
  health: {
    score: band === "critical" ? 0 : 40,
    band,
    critical_factor_count: factors.some((f) => f.rule_key === "usn.critical")
      ? 1
      : 0,
    factors,
    recommended_actions: [],
    updated_at: null,
  },
});

// Three computers carry USN factors. `usn.critical` and `usn.high` overlap on
// id=11; `usn.high` and `usn.medium` overlap on id=12; id=13 is reboot-only.
// The detractor sum across usn.* would be 4 (1+2+1), but the unique-instance
// count is 3 — this is the de-dup regression we care about.
const i11 = instance(11, "crit-and-high", [F_CRITICAL, F_HIGH]);
const i12 = instance(12, "high-and-medium", [F_HIGH, F_MEDIUM]);
const i14 = instance(14, "medium-only", [F_MEDIUM], "warning");
const i13 = instance(
  13,
  "reboot-only",
  [F_REBOOT, F_OFFLINE],
  "warning",
);

const DETRACTORS: FleetTopDetractor[] = [
  {
    rule_id: 1,
    rule_key: "usn.critical",
    title: "Critical security notice",
    description: "Pending USN with Ubuntu Priority `critical`.",
    weight: 100,
    computer_count: 1,
  },
  {
    rule_id: 2,
    rule_key: "usn.high",
    title: "High security notice",
    description: "Pending USN with Ubuntu Priority `high`.",
    weight: 20,
    computer_count: 2,
  },
  {
    rule_id: 3,
    rule_key: "usn.medium",
    title: "Medium security notice",
    description: "Pending USN with Ubuntu Priority `medium`.",
    weight: 5,
    computer_count: 2,
  },
  {
    rule_id: 5,
    rule_key: "reboot_required",
    title: "Reboot required",
    description: "ComputerStatus.reboot_required_flag is true.",
    weight: 10,
    computer_count: 1,
  },
  {
    rule_id: 6,
    rule_key: "instance.offline",
    title: "Instance offline",
    description: "Offline > 24h.",
    weight: 20,
    computer_count: 1,
  },
];

const SUMMARY: FleetHealthSummary = {
  account_id: 1,
  band_critical_count: 2,
  band_warning_count: 2,
  band_healthy_count: 10,
  total_count: 14,
  measurable_count: 14,
  kernel_usns_waived_count: 0,
  updated_at: "2026-05-20T12:00:00Z",
};

const mockDetractors = (
  results: FleetTopDetractor[] = DETRACTORS,
  overrides: { isLoading?: boolean; isSuccess?: boolean } = {},
): void => {
  vi.mocked(useFleetTopDetractors).mockReturnValue({
    data: { data: { results } } as AxiosResponse<{
      results: FleetTopDetractor[];
    }>,
    isLoading: overrides.isLoading ?? false,
    isSuccess: overrides.isSuccess ?? true,
    // The component only reads these three keys; cast to bypass the full
    // useQuery return type without restating it.
  } as unknown as ReturnType<typeof useFleetTopDetractors>);
};

const mockSummary = (
  summary: FleetHealthSummary = SUMMARY,
  overrides: { isLoading?: boolean } = {},
): void => {
  vi.mocked(useFleetHealthSummary).mockReturnValue({
    data: { data: summary } as AxiosResponse<FleetHealthSummary>,
    isLoading: overrides.isLoading ?? false,
  } as unknown as ReturnType<typeof useFleetHealthSummary>);
};

const mockInstances = (
  instances: Instance[],
  overrides: { isGettingInstances?: boolean } = {},
): void => {
  vi.mocked(useGetInstances).mockReturnValue({
    instances,
    instancesCount: instances.length,
    instancesError: null,
    isErrorInstances: false,
    isFetchingInstances: false,
    isGettingInstances: overrides.isGettingInstances ?? false,
    refetchInstances: vi.fn(),
  } as unknown as ReturnType<typeof useGetInstances>);
};

const mockHealthAction = (): void => {
  vi.mocked(useHealthAction).mockReturnValue({
    mutateAsync,
  } as unknown as ReturnType<typeof useHealthAction>);
};

const findReactChild = (node: ReactNode): ReactElement | null => {
  if (!isValidElement(node)) return null;
  // The side-panel body is <Suspense><Upgrades ... /></Suspense>. The
  // Upgrades element is the Suspense element's `children` prop.
  const { children } = (node.props as { children?: ReactNode });
  return isValidElement(children) ? children : null;
};

describe("RemediationPile", () => {
  beforeEach(() => {
    mockSidePanel();
    mockHealthAction();
    mockInstances([i11, i12, i14, i13]);
    mockSummary();
    mockDetractors();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the three action cards with their titles", () => {
    renderWithProviders(<RemediationPile />);
    expect(
      screen.getByRole("heading", { name: /Apply security updates/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Reboot pending/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Refresh stale instances/i }),
    ).toBeInTheDocument();
  });

  it("counts unique instances per card, not the detractor sum across rule_keys", () => {
    renderWithProviders(<RemediationPile />);
    // Security card: detractor sum across usn.critical/high/medium = 5
    // (1+2+2). Unique instances with any usn.* factor in the mocked fleet =
    // 3 (i11, i12, i14). The card must show the de-duped count.
    expect(
      screen.getByRole("button", { name: /Run on 3 instances/i }),
    ).toBeInTheDocument();
    // Reboot card: one instance (i13). Detractor row also reports 1.
    expect(
      screen.getByRole("button", { name: /Run on 1 instance$/i }),
    ).toBeInTheDocument();
  });

  it("uses the detractor-weighted sum for the points-cleared estimate", () => {
    renderWithProviders(<RemediationPile />);
    // usn.critical: 100×1 + usn.high: 20×2 + usn.medium: 5×2 = 150 points.
    expect(screen.getByText(/−150 points/)).toBeInTheDocument();
    // reboot_required: 10×1 = 10 points.
    expect(screen.getByText(/−10 points/)).toBeInTheDocument();
  });

  it("opens the Upgrades side panel with health-engine selection on Apply security updates", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RemediationPile />);
    await user.click(screen.getByRole("button", { name: /Run on 3 instances/i }));

    expect(setSidePanelContent).toHaveBeenCalledTimes(1);
    const call = setSidePanelContent.mock.calls[0];
    if (!call) throw new Error("setSidePanelContent was not called");
    const [title, body, size] = call;
    expect(title).toBe("Apply security updates");
    expect(size).toBe("large");

    const upgrades = findReactChild(body as ReactNode);
    if (!upgrades) throw new Error("Upgrades element missing from panel body");
    const props = upgrades.props as {
      selectedInstances: Instance[];
      trustSelection: boolean;
      initialTabId: string;
    };
    // Hands the health-engine-flagged set (i11, i12, i14) to <Upgrades>,
    // tells it to skip the alerts-based re-filter, and opens on the USNs tab.
    expect(props.trustSelection).toBe(true);
    expect(props.initialTabId).toBe("tab-link-usns");
    expect(props.selectedInstances.map((i) => i.id)).toEqual([11, 12, 14]);
  });

  it("opens RestartModal on Reboot pending", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RemediationPile />);
    await user.click(screen.getByRole("button", { name: /Run on 1 instance$/i }));
    // RestartModal renders a confirmation dialog titled with the instance
    // title — see RestartModal.tsx pluralizeArray usage.
    expect(
      await screen.findByRole("dialog", { name: /reboot-only/i }),
    ).toBeInTheDocument();
    // The side panel is NOT used for reboot.
    expect(setSidePanelContent).not.toHaveBeenCalled();
  });

  it("dispatches refresh-facts per matched instance on Refresh stale", async () => {
    const user = userEvent.setup();
    // Tweak the fleet so exactly one instance has the `instance.offline`
    // factor; refresh-facts should fire one mutation against id=13.
    mockInstances([i11, i12, i14, i13]);
    renderWithProviders(<RemediationPile />);

    const refreshCard = screen
      .getByRole("heading", { name: /Refresh stale instances/i })
      .closest("article");
    if (!refreshCard) throw new Error("refresh card not found");
    const button = refreshCard.querySelector("button");
    if (!button) throw new Error("refresh button not found");
    await user.click(button);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        computerId: 13,
        action: "refresh-facts",
      });
    });
    expect(setSidePanelContent).not.toHaveBeenCalled();
  });

  it("disables a card whose matched-instance set is empty", () => {
    // Drop the offline instance — the Refresh-stale card has nothing to do.
    mockInstances([i11, i12, i14]);
    renderWithProviders(<RemediationPile />);
    const refreshCard = screen
      .getByRole("heading", { name: /Refresh stale instances/i })
      .closest("article");
    if (!refreshCard) throw new Error("refresh card not found");
    const button = refreshCard.querySelector("button");
    expect(button).toBeDisabled();
    expect(button?.textContent).toMatch(/Nothing to do/i);
  });

  it("renders the Livepatch waiver badge when kernel_usns_waived_count is positive", () => {
    mockSummary({ ...SUMMARY, kernel_usns_waived_count: 4 });
    renderWithProviders(<RemediationPile />);
    expect(
      screen.getByText(/4 kernel USNs waived by Livepatch/i),
    ).toBeInTheDocument();
  });

  it("renders the fully-remediated empty state when no card has any work", () => {
    mockDetractors([]);
    mockInstances([]);
    renderWithProviders(<RemediationPile />);
    expect(
      screen.getByText(/Fleet is fully remediated/i),
    ).toBeInTheDocument();
  });

  it("renders the loading state while the detractor query is in flight", () => {
    mockDetractors([], { isLoading: true, isSuccess: false });
    renderWithProviders(<RemediationPile />);
    expect(screen.getByText(/Loading remediation pile…/i)).toBeInTheDocument();
  });
});
