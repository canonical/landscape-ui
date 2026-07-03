import type { ComplianceReport } from "../../types";
import type { DonutSegment } from "../ReportDonutChart";

export interface PatchBucket {
  readonly key: string;
  readonly label: string;
  readonly ids: readonly number[];
  readonly color: DonutSegment["color"];
  readonly detail?: string;
}

/**
 * Split the compliance report into the mutually-exclusive "time to patch USNs"
 * buckets shown in the donut, worst first.
 *
 * Every instance lands in exactly one bucket: instances with USNs outstanding
 * for over 60 days take priority, the rest are split by the longest time they
 * took to apply a USN (the `usn_fixed_in` buckets are cumulative, so each named
 * interval subtracts the shorter ones and the 60+ pending set). Whatever the
 * server accounted for but cannot place in a named interval — USNs still
 * unpatched for under 60 days, or patched after more than 60 days — is reported
 * honestly as "Other".
 *
 * The exact computer ids are carried per bucket so a deep link matches the
 * report's count precisely.
 */
export const derivePatchBuckets = (report: ComplianceReport): PatchBucket[] => {
  const pendingIds = report.usn_pending_over_60_days.computer_ids;
  const withinTwoIds = report.usn_fixed_in["2"].computer_ids;
  const withinFourteenIds = report.usn_fixed_in["14"].computer_ids;
  const withinThirtyIds = report.usn_fixed_in["30"].computer_ids;
  const withinSixtyIds = report.usn_fixed_in["60"].computer_ids;
  const pendingSet = new Set(pendingIds);
  const withinTwoSet = new Set(withinTwoIds);
  const withinFourteenSet = new Set(withinFourteenIds);
  const withinThirtySet = new Set(withinThirtyIds);

  const sixtyPlusIds = pendingIds;
  const withinTwoBucket = withinTwoIds.filter((id) => !pendingSet.has(id));
  const twoToFourteenIds = withinFourteenIds.filter(
    (id) => !withinTwoSet.has(id) && !pendingSet.has(id),
  );
  const fourteenToThirtyIds = withinThirtyIds.filter(
    (id) => !withinFourteenSet.has(id) && !pendingSet.has(id),
  );
  const thirtyToSixtyIds = withinSixtyIds.filter(
    (id) => !withinThirtySet.has(id) && !pendingSet.has(id),
  );
  const classified = new Set([
    ...sixtyPlusIds,
    ...withinTwoBucket,
    ...twoToFourteenIds,
    ...fourteenToThirtyIds,
    ...thirtyToSixtyIds,
  ]);
  // "Other" is the accounted instances not in any named bucket. Derive the
  // universe from the report's own id sets (every accounted instance appears in
  // securely/not-securely-patched and/or the USN sets) rather than from the raw
  // selection, which may include instances the server didn't account for.
  const accountedIds = new Set<number>([
    ...report.securely_patched.computer_ids,
    ...report.not_securely_patched.computer_ids,
    ...withinSixtyIds,
    ...pendingIds,
  ]);
  const otherIds = [...accountedIds].filter((id) => !classified.has(id));

  return [
    {
      key: "over-60",
      label: "60+ days outstanding",
      ids: sixtyPlusIds,
      color: "red",
    },
    {
      key: "30-60",
      label: "30–60 days",
      ids: thirtyToSixtyIds,
      color: "orange",
    },
    {
      key: "14-30",
      label: "14–30 days",
      ids: fourteenToThirtyIds,
      color: "orangeLight",
    },
    {
      key: "2-14",
      label: "2–14 days",
      ids: twoToFourteenIds,
      color: "greenLight",
    },
    {
      key: "within-2",
      label: "Within 2 days",
      ids: withinTwoBucket,
      color: "green",
    },
    {
      key: "other",
      label: "Other",
      ids: otherIds,
      color: "grey",
      detail:
        "Instances that took more than 60 days to apply a USN, or have an unapplied USN released within the last 60 days.",
    },
  ];
};
