import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AttachmentFile from "./AttachmentFile";

const createObjectURLMock = vi.fn((_object: Blob | MediaSource) => "blob:test");
const revokeObjectURLMock = vi.fn();

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: createObjectURLMock,
});
Object.defineProperty(URL, "revokeObjectURL", {
  writable: true,
  value: revokeObjectURLMock,
});

const baseProps: ComponentProps<typeof AttachmentFile> = {
  attachmentId: 1,
  filename: "test.txt",
};

const propsWithScriptId: ComponentProps<typeof AttachmentFile> = {
  ...baseProps,
  scriptId: 1,
};

const propsWithInitialAttachmentDelete: ComponentProps<typeof AttachmentFile> =
  {
    ...baseProps,
    onInitialAttachmentDelete: vi.fn(),
  };

describe("AttachmentFile", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should display attachment file with script id prop", async () => {
    renderWithProviders(<AttachmentFile {...propsWithScriptId} />);

    expect(screen.getByText(/test.txt/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Download ${propsWithScriptId.filename}`,
      }),
    ).toBeInTheDocument();

    const deleteButton = screen.queryByRole("button", {
      name: `Remove ${propsWithScriptId.filename} attachment`,
    });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should display attachment file with initial attachment delete prop", async () => {
    renderWithProviders(
      <AttachmentFile {...propsWithInitialAttachmentDelete} />,
    );

    expect(screen.getByText(/test.txt/i)).toBeInTheDocument();
    const downloadButton = screen.queryByRole("button", {
      name: `Download ${propsWithInitialAttachmentDelete.filename}`,
    });

    expect(downloadButton).not.toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: `Remove ${propsWithInitialAttachmentDelete.filename} attachment`,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls delete callback when remove button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AttachmentFile {...propsWithInitialAttachmentDelete} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${propsWithInitialAttachmentDelete.filename} attachment`,
      }),
    );

    expect(
      propsWithInitialAttachmentDelete.onInitialAttachmentDelete,
    ).toHaveBeenCalledTimes(1);
  });

  it("downloads attachment file when download button is clicked", async () => {
    const user = userEvent.setup();
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const createObjectUrlSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:attachment");
    const revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL");

    renderWithProviders(<AttachmentFile {...propsWithScriptId} />);

    await user.click(
      screen.getByRole("button", {
        name: `Download ${propsWithScriptId.filename}`,
      }),
    );

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);

    const [downloadedAttachmentBlob] = createObjectUrlSpy.mock.calls[0] ?? [];
    expect(downloadedAttachmentBlob).toBeInstanceOf(Blob);
    expect(await (downloadedAttachmentBlob as Blob).text()).toContain(
      "attachment",
    );

    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:attachment");
  });

  it("does not try to download when attachment data is missing", async () => {
    const user = userEvent.setup();
    const createObjectUrlSpy = vi.spyOn(URL, "createObjectURL");
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const missingDataProps: ComponentProps<typeof AttachmentFile> = {
      attachmentId: 999,
      filename: "missing.txt",
      scriptId: 999,
    };

    renderWithProviders(<AttachmentFile {...missingDataProps} />);

    await user.click(
      screen.getByRole("button", {
        name: `Download ${missingDataProps.filename}`,
      }),
    );

    expect(createObjectUrlSpy).not.toHaveBeenCalled();
    expect(anchorClickSpy).not.toHaveBeenCalled();
  });
});
