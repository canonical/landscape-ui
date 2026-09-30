import { availableSnapInfo } from "@/tests/mocks/snap";
import { assert, describe, expect, it } from "vitest";
import { getChannelOptions } from "./helpers";

// Snap 3 publishes "latest" as amd64/strict and amd86/classic.
const multiArchSnapInfo = availableSnapInfo.find(
  ({ name }) => name === "Snap 3",
);
assert(multiArchSnapInfo, "Snap 3 fixture not found");
const multiArchChannelMap = [...multiArchSnapInfo["channel-map"]];

describe("getChannelOptions", () => {
  it("deduplicates a channel published for multiple architectures", () => {
    expect(getChannelOptions(multiArchChannelMap)).toHaveLength(1);
  });

  it("marks a channel classic when any architecture is classic, regardless of order", () => {
    const [option] = getChannelOptions(multiArchChannelMap);
    const [reversedOption] = getChannelOptions(
      [...multiArchChannelMap].reverse(),
    );

    expect(option?.confinement).toBe("classic");
    expect(reversedOption?.confinement).toBe("classic");
  });
});
