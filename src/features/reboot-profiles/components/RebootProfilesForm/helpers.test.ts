import { describe, expect, it } from "vitest";
import { getValidationSchema } from "./helpers";

describe.each(["add", "edit", "duplicate"] as const)(
  "reboot profile expiration validation (%s)",
  (action) => {
    const schema = getValidationSchema(action);

    it.each([0, "0 ", -1, "-1 ", "", " ", undefined, "1.5", "invalid"])(
      "rejects %j",
      async (deliver_within) => {
        await expect(
          schema.validateAt("deliver_within", { deliver_within }),
        ).rejects.toThrow();
      },
    );

    it.each([1, 2, "1", "1 "])("accepts %j", async (deliver_within) => {
      await expect(
        schema.validateAt("deliver_within", { deliver_within }),
      ).resolves.toBe(Number(deliver_within));
    });

    it.each(["abc", "1abc", " ", "", undefined])(
      "reports guidance for missing or malformed input %j",
      async (deliver_within) => {
        await expect(
          schema.validateAt("deliver_within", { deliver_within }),
        ).rejects.toThrow("Enter an integer greater than or equal to 1.");
      },
    );
  },
);
