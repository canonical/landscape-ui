import { describe, expect, it, vi } from "vitest";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  formatTitleCase,
  getAuthorInfo,
  getCode,
  getCreateAttachmentsPromises,
  getCreateScriptParams,
  getEditScriptParams,
  removeFileExtension,
} from "./helpers";

const SCRIPT_ID = 42;
const FILE_CONTENT = "hello world";
const emptyAttachments = {
  first: null,
  second: null,
  third: null,
  fourth: null,
  fifth: null,
};

describe("scripts helpers", () => {
  it("builds create params with encoded code and trimmed title", () => {
    const params = getCreateScriptParams({
      title: "  My Script  ",
      code: "#!/bin/bash\necho hi\r\n",
      access_group: "global",
      attachments: emptyAttachments,
      attachmentsToRemove: [],
    });

    expect(params.title).toBe("My Script");
    expect(params.script_type).toBe("V2");
    expect(params.access_group).toBe("global");
    expect(params.code).toBe("IyEvYmluL2Jhc2gKZWNobyBoaQo=");
  });

  it("builds edit params with script id", () => {
    const params = getEditScriptParams({
      scriptId: SCRIPT_ID,
      values: {
        title: "  Updated Script  ",
        code: "echo edited",
        access_group: "global",
        attachments: emptyAttachments,
        attachmentsToRemove: [],
      },
    });

    expect(params.script_id).toBe(SCRIPT_ID);
    expect(params.title).toBe("Updated Script");
    expect(params.code).toBe("ZWNobyBlZGl0ZWQ=");
  });

  it("creates attachment upload promises with encoded payloads", async () => {
    const createScriptAttachment = vi.fn().mockResolvedValue({ ok: true });

    const textFile = new File([FILE_CONTENT], "notes.txt", {
      type: "text/plain",
    });
    const binaryFile = new File([new Uint8Array([1, 2, 3])], "blob.bin", {
      type: "application/octet-stream",
    });

    const uploadPromises = await getCreateAttachmentsPromises({
      attachments: [textFile, binaryFile],
      createScriptAttachment,
      script_id: SCRIPT_ID,
    });

    await Promise.all(uploadPromises);

    expect(createScriptAttachment).toHaveBeenCalledTimes(2);
    expect(createScriptAttachment).toHaveBeenNthCalledWith(1, {
      file: "notes.txt$$aGVsbG8gd29ybGQ=",
      script_id: SCRIPT_ID,
    });
    expect(createScriptAttachment).toHaveBeenNthCalledWith(2, {
      file: "blob.bin$$AQID",
      script_id: SCRIPT_ID,
    });
  });

  it("handles common filename transformations", () => {
    expect(removeFileExtension("archive.tar.gz")).toBe("archive.tar");
    expect(removeFileExtension("README")).toBe("README");
    expect(formatTitleCase("hELLO")).toBe("Hello");
  });

  it("formats shebang code and author metadata", () => {
    const interpreter = "/usr/bin/python3";
    const code = "print('ok')";
    const date = "2024-01-01T12:34:56Z";

    expect(getCode({ interpreter, code })).toBe(
      "#!/usr/bin/python3\nprint('ok')",
    );
    expect(getAuthorInfo({ author: "alice", date })).toBe(
      `${moment(date).format(DISPLAY_DATE_TIME_FORMAT)}, by alice`,
    );
  });
});
