import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileTypes } from "../../../../helpers";
import AssociatedInstancesCell from "./AssociatedInstancesCell";
import { profiles } from "@/tests/mocks/profiles";
import { expectLoadingState } from "@/tests/helpers";

const [baseProfile] = profiles;

describe("AssociatedInstancesCell", () => {
  it.each([
    [ProfileTypes.repository, { ...baseProfile, apt_sources: [] }, "35"],
    [ProfileTypes.security, { ...baseProfile, benchmark: "cis_level1", associated_instances: 999 }, "999"],
    [
      ProfileTypes.reboot,
      {
        ...baseProfile,
        num_computers: 16,
        schedule: "schedule",
        next_run: "next run",
      },
      "16"
    ],
    [
      ProfileTypes.package,
      {
        ...baseProfile,
        constraints: {
          constraint: "depends",
          id: 1,
          package: "package",
          rule: "rule",
          version: "1.0.0",
        },
        computers: {
          constrained: [1, 2, 3, 4],
        }
      },
      "4",
    ],
    [ProfileTypes.script, { ...baseProfile, script_id: 3, computers: { num_associated_computers: 10000 }, trigger: { trigger_type: "one_time" } }, "10,000"],
    [ProfileTypes.removal, { ...baseProfile, days_without_exchange: 30 , computers: { num_associated_computers: 5 } }, "5"],
    [ProfileTypes.upgrade, { ...baseProfile, upgrade_type: "all", computers: { num_associated_computers: 10 } }, "10"],
    [ProfileTypes.wsl, { ...baseProfile, image_name: "image", computers: { constrained: [6, 7] } }, "2"],
  ])(
    "renders correct query and count for %s profile",
    async (type, profile, expectedCount) => {
    renderWithProviders(
      <AssociatedInstancesCell profile={profile} type={type} />,
    );

    if (type === ProfileTypes.repository) {
      await expectLoadingState();
    }

    expect(screen.getByRole("link", { name: `${expectedCount} instances` })).toHaveAttribute(
      "href",
      expect.stringContaining(`profile%3A${type.toLowerCase()}%3A1`),
    );
  });
});
