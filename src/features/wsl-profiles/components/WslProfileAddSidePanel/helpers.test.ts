import { describe, expect, it, vi } from "vitest";
import { getCloudInitFile, getValidationSchema } from "./helpers";

const schema = getValidationSchema();

const BASE_VALUES = {
  title: "My WSL profile",
  access_group: "global",
  description: "A description",
  instanceType: "Ubuntu",
  customImageName: "",
  rootfsImage: "",
  cloudInitType: "",
  cloudInit: null,
  all_computers: false,
  tags: [],
  only_landscape_created: false,
};

const BYTES_PER_MB = 1024 * 1024;

describe("getValidationSchema", () => {
  it("accepts a valid stock-image profile", async () => {
    await expect(schema.validate(BASE_VALUES)).resolves.toBeTruthy();
  });

  it("requires a rootfs image URL for a custom image", async () => {
    await expect(
      schema.validate({
        ...BASE_VALUES,
        instanceType: "custom",
        customImageName: "my-image",
        rootfsImage: "",
      }),
    ).rejects.toThrow("This field is required");
  });

  it("rejects reserved custom image names", async () => {
    await expect(
      schema.validate({
        ...BASE_VALUES,
        instanceType: "custom",
        customImageName: "ubuntu-24.04",
        rootfsImage: "https://example.com/rootfs",
      }),
    ).rejects.toThrow(/Image name cannot match/);
  });

  it("accepts a non-reserved custom image name", async () => {
    await expect(
      schema.validate({
        ...BASE_VALUES,
        instanceType: "custom",
        customImageName: "my-custom-image",
        rootfsImage: "https://example.com/rootfs",
      }),
    ).resolves.toBeTruthy();
  });

  it("rejects a cloud-init file larger than the allowed size", async () => {
    const oversizedFile = new File(
      [new Uint8Array(BYTES_PER_MB + 1)],
      "big.yaml",
      { type: "application/x-yaml" },
    );

    await expect(
      schema.validateAt("cloudInit", {
        cloudInitType: "file",
        cloudInit: oversizedFile,
      }),
    ).rejects.toThrow("File size must be less than 1MB");
  });

  it("accepts a cloud-init file within the allowed size", async () => {
    const smallFile = new File(["#cloud-config"], "small.yaml", {
      type: "application/x-yaml",
    });

    await expect(
      schema.validateAt("cloudInit", {
        cloudInitType: "file",
        cloudInit: smallFile,
      }),
    ).resolves.toBeTruthy();
  });

  it("does not crash the size check on an empty cloud-init value", async () => {
    await expect(
      schema.validateAt("cloudInit", {
        cloudInitType: "file",
        cloudInit: false as unknown as File,
      }),
    ).resolves.toBe(false);
  });

  it("rejects a cloud-init value that has no size", async () => {
    await expect(
      schema.validateAt("cloudInit", {
        cloudInitType: "file",
        cloudInit: {} as unknown as File,
      }),
    ).rejects.toThrow("File size must be less than 1MB");
  });
});

describe("getCloudInitFile", () => {
  it("returns undefined when there is no cloud-init", async () => {
    await expect(getCloudInitFile(null)).resolves.toBeUndefined();
  });

  it("returns the base64 payload for a file", async () => {
    const file = new File(["#cloud-config"], "cloud-init.yaml", {
      type: "application/x-yaml",
    });

    const result = await getCloudInitFile(file);

    expect(typeof result).toBe("string");
    expect(result).not.toContain(",");
  });

  it("returns the base64 payload for plain-text content", async () => {
    const result = await getCloudInitFile("#cloud-config");

    expect(typeof result).toBe("string");
    expect(result).not.toContain(",");
  });

  it("rejects when the file cannot be read", async () => {
    const file = new File(["#cloud-config"], "cloud-init.yaml", {
      type: "application/x-yaml",
    });

    const spy = vi
      .spyOn(FileReader.prototype, "readAsDataURL")
      .mockImplementation(function (this: FileReader) {
        setTimeout(() => {
          this.onerror?.(
            new ProgressEvent("error") as ProgressEvent<FileReader>,
          );
        }, 0);
      });

    await expect(getCloudInitFile(file)).rejects.toBeDefined();

    spy.mockRestore();
  });
});
