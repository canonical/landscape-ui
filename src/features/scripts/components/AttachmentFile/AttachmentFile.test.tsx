import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import AttachmentFile from "./AttachmentFile";

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
});
