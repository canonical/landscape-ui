import { describe, expect, it } from "vitest";
import { pockets } from "@/tests/mocks/pockets";
import type { Pocket } from "../../types";
import {
  getEditPocketParams,
  getInitialValues,
  getValidationSchema,
} from "./helpers";
import { INITIAL_VALUES } from "./constants";

const mirrorPocket = pockets.find((pocket) => pocket.mode === "mirror");
const uploadPocket = pockets.find((pocket) => pocket.mode === "upload");
const pullPocket = pockets.find((pocket) => pocket.mode === "pull");

assert(mirrorPocket);
assert(uploadPocket);
assert(pullPocket);

describe("EditPocketForm helpers", () => {
  it("enforces single component for mirror suite directories", async () => {
    const schema = getValidationSchema("mirror");

    await expect(
      schema.validate({
        ...INITIAL_VALUES,
        name: "Pocket",
        distribution: "Distribution",
        series: "Series",
        mirror_suite: "focal/",
        components: ["main", "restricted"],
        architectures: ["amd64"],
      }),
    ).rejects.toThrowError(/single component must be passed/i);

    await expect(
      schema.validate({
        ...INITIAL_VALUES,
        name: "Pocket",
        distribution: "Distribution",
        series: "Series",
        mirror_suite: "focal/",
        components: ["main"],
        architectures: ["amd64"],
      }),
    ).resolves.toBeTruthy();
  });

  it("allows multiple components for non-mirror modes", async () => {
    const schema = getValidationSchema("pull");

    await expect(
      schema.validate({
        ...INITIAL_VALUES,
        name: "Pocket",
        distribution: "Distribution",
        series: "Series",
        components: ["main", "restricted"],
        architectures: ["amd64"],
      }),
    ).resolves.toBeTruthy();
  });

  it("allows multiple components in mirror mode when suite is not a directory", async () => {
    const schema = getValidationSchema("mirror");

    await expect(
      schema.validate({
        ...INITIAL_VALUES,
        name: "Pocket",
        distribution: "Distribution",
        series: "Series",
        mirror_suite: "focal-updates",
        components: ["main", "restricted"],
        architectures: ["amd64"],
      }),
    ).resolves.toBeTruthy();
  });

  it("builds mode-specific initial values", () => {
    const mirrorValues = getInitialValues("Dist", "Series", mirrorPocket);
    const uploadValues = getInitialValues("Dist", "Series", uploadPocket);
    const pullValues = getInitialValues("Dist", "Series", pullPocket);

    expect(mirrorValues.mirror_uri).toBe(mirrorPocket.mirror_uri);
    expect(mirrorValues.mirror_suite).toBe(mirrorPocket.mirror_suite);
    expect(uploadValues.upload_allow_unsigned).toBe(
      uploadPocket.upload_allow_unsigned,
    );
    expect(uploadValues.upload_gpg_keys).toEqual(
      uploadPocket.upload_gpg_keys.map((key) => key.name),
    );
    expect(pullValues.filters).toEqual(pullPocket.filters);
  });

  it("falls back to empty key names when optional key objects are missing", () => {
    const pocketWithoutKeys = {
      ...mirrorPocket,
      gpg_key: undefined,
      mirror_gpg_key: undefined,
    } as unknown as Pocket;

    const values = getInitialValues("Dist", "Series", pocketWithoutKeys);

    expect(values.gpg_key).toBe("");
    expect(values.mirror_gpg_key).toBe("");
  });

  it("returns mode-specific edit params", () => {
    const mirrorValues = getInitialValues("Dist", "Series", mirrorPocket);
    const uploadValues = getInitialValues("Dist", "Series", uploadPocket);
    const pullValues = getInitialValues("Dist", "Series", pullPocket);

    const mirrorParams = getEditPocketParams(mirrorValues, "mirror");
    const uploadParams = getEditPocketParams(uploadValues, "upload");
    const pullParams = getEditPocketParams(pullValues, "pull");

    expect(mirrorParams).toHaveProperty("mirror_uri");
    expect(mirrorParams).toHaveProperty("mirror_suite");
    expect(uploadParams).toHaveProperty("upload_allow_unsigned");
    expect(pullParams).not.toHaveProperty("mirror_uri");
    expect(pullParams).not.toHaveProperty("upload_allow_unsigned");
  });

  it("throws for invalid pocket mode when building edit params", () => {
    expect(() =>
      getEditPocketParams(
        getInitialValues("Dist", "Series", pullPocket),
        "invalid" as Pocket["mode"],
      ),
    ).toThrowError(/provided: invalid for pocket mode/i);
  });
});
