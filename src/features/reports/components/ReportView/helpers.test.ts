import { describe, expect, it } from "vitest";
import type { ComplianceReport } from "../../types";
import { derivePatchBuckets } from "./helpers";

// Ids outside any USN interval, used to exercise the "Other" fall-through.
const SECURELY_PATCHED_A = 100;
const SECURELY_PATCHED_B = 101;
const NOT_SECURELY_PATCHED = 102;

const emptyBucket = () => ({ count: 0, computer_ids: [] as number[] });

const makeReport = (
  overrides: Partial<ComplianceReport> = {},
): ComplianceReport => ({
  generated_at: "2024-01-01T00:00:00Z",
  total: 0,
  securely_patched: emptyBucket(),
  not_securely_patched: emptyBucket(),
  covered_by_upgrade_profiles: emptyBucket(),
  contacted_recently: emptyBucket(),
  usn_fixed_in: {
    "2": emptyBucket(),
    "14": emptyBucket(),
    "30": emptyBucket(),
    "60": emptyBucket(),
  },
  usn_pending_over_60_days: emptyBucket(),
  ...overrides,
});

const idsByKey = (report: ComplianceReport): Record<string, number[]> =>
  Object.fromEntries(
    derivePatchBuckets(report).map((bucket) => [bucket.key, [...bucket.ids]]),
  );

describe("derivePatchBuckets", () => {
  it("returns the six buckets worst-first", () => {
    expect(
      derivePatchBuckets(makeReport()).map((bucket) => bucket.key),
    ).toEqual(["over-60", "30-60", "14-30", "2-14", "within-2", "other"]);
  });

  it("makes the cumulative fixed_in buckets disjoint, worst wins", () => {
    // id 9 appears in every fixed_in bucket but is also pending over 60 days,
    // so it must land only in the 60+ bucket and be excluded from the rest.
    const report = makeReport({
      usn_pending_over_60_days: { count: 2, computer_ids: [9, 10] },
      usn_fixed_in: {
        "2": { count: 3, computer_ids: [1, 2, 9] },
        "14": { count: 4, computer_ids: [1, 2, 3, 9] },
        "30": { count: 5, computer_ids: [1, 2, 3, 4, 9] },
        "60": { count: 6, computer_ids: [1, 2, 3, 4, 5, 9] },
      },
    });

    const buckets = idsByKey(report);
    expect(buckets["over-60"]).toEqual([9, 10]);
    expect(buckets["within-2"]).toEqual([1, 2]);
    expect(buckets["2-14"]).toEqual([3]);
    expect(buckets["14-30"]).toEqual([4]);
    expect(buckets["30-60"]).toEqual([5]);
  });

  it("derives Other from accounted instances not in any named bucket", () => {
    // Accounted instances that never appear in a USN interval fall through to
    // Other; ids only present in the raw selection are never invented here.
    const report = makeReport({
      securely_patched: {
        count: 2,
        computer_ids: [SECURELY_PATCHED_A, SECURELY_PATCHED_B],
      },
      not_securely_patched: { count: 1, computer_ids: [NOT_SECURELY_PATCHED] },
    });

    expect((idsByKey(report)["other"] ?? []).sort((a, b) => a - b)).toEqual([
      SECURELY_PATCHED_A,
      SECURELY_PATCHED_B,
      NOT_SECURELY_PATCHED,
    ]);
  });

  it("keeps a securely-patched instance out of Other once it is classified", () => {
    const report = makeReport({
      securely_patched: { count: 2, computer_ids: [1, 2] },
      usn_fixed_in: {
        "2": { count: 1, computer_ids: [1] },
        "14": { count: 1, computer_ids: [1] },
        "30": { count: 1, computer_ids: [1] },
        "60": { count: 1, computer_ids: [1] },
      },
    });

    const buckets = idsByKey(report);
    expect(buckets["within-2"]).toEqual([1]);
    expect(buckets["other"]).toEqual([2]);
  });
});
