import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, it, vi } from "vitest";
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
  beforeEach(() => {
    setEndpointStatus("default");
    vi.clearAllMocks();
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

  it("downloads blob attachments and revokes object URL", async () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    renderWithProviders(<AttachmentFile {...propsWithScriptId} />);
    await user.click(
      screen.getByRole("button", {
        name: `Download ${propsWithScriptId.filename}`,
      }),
    );

    await waitFor(() => {
      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:test");
    });

    const blobToDownload = createObjectURLMock.mock.calls[0]?.[0];
    expect(blobToDownload).toBeInstanceOf(Blob);
    if (!(blobToDownload instanceof Blob)) {
      throw new Error("Expected downloaded data to be a Blob.");
    }
    expect(blobToDownload.type).toContain("text/plain");

    clickSpy.mockRestore();
  });
});
