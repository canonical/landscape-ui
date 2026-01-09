import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import type { Attachment } from "../../types";
import ScriptFormAttachments from "./ScriptFormAttachments";

describe("ScriptFormAttachments", () => {
  const getFileInputError = vi.fn();
  const onFileInputChange = vi.fn();
  const onInitialAttachmentDelete = vi.fn();

  const props: ComponentProps<typeof ScriptFormAttachments> = {
    attachments: {
      first: null,
      second: null,
      third: null,
      fourth: null,
      fifth: null,
    },
    attachmentsToRemove: [],
    getFileInputError,
    initialAttachments: [],
    onFileInputChange,
    onInitialAttachmentDelete,
  };

  const fullAttachments = [
    {
      id: 1,
      filename: "first",
    },
    {
      id: 2,
      filename: "second",
    },
    {
      id: 3,
      filename: "third",
    },
    {
      id: 4,
      filename: "fourth",
    },
    {
      id: 5,
      filename: "fifth",
    },
  ] as const satisfies Attachment[];

  it("should render file inputs only", () => {
    renderWithProviders(<ScriptFormAttachments {...props} />);

    for (const attachment in props.attachments) {
      expect(
        screen.queryByRole("button", {
          name: `Remove ${attachment} attachment`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByLabelText(`${attachment} attachment`),
      ).toBeInTheDocument();
    }
  });

  it("should render remove buttons only", () => {
    renderWithProviders(
      <ScriptFormAttachments {...props} initialAttachments={fullAttachments} />,
    );

    for (const key in props.attachments) {
      expect(
        screen.getByRole("button", { name: `Remove ${key} attachment` }),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText(`${key} attachment`),
      ).not.toBeInTheDocument();
    }
  });

  it("should render remove buttons and file inputs", () => {
    renderWithProviders(
      <ScriptFormAttachments
        {...props}
        attachmentsToRemove={fullAttachments
          .slice(0, 2)
          .map((attachment) => attachment.filename)}
        initialAttachments={fullAttachments}
      />,
    );

    for (const initialAttachment of fullAttachments.slice(2)) {
      expect(
        screen.getByLabelText(
          `Remove ${initialAttachment.filename} attachment`,
        ),
      ).toBeInTheDocument();
    }

    for (const attachment of fullAttachments.slice(0, 2)) {
      expect(
        screen.getByText(`${attachment.filename} attachment`),
      ).toBeInTheDocument();
    }
  });

  it("should render single remove button and several file inputs", () => {
    renderWithProviders(
      <ScriptFormAttachments
        {...props}
        initialAttachments={[fullAttachments[4]]}
      />,
    );

    expect(
      screen.getByLabelText(`Remove ${fullAttachments[4].filename} attachment`),
    ).toBeInTheDocument();

    for (const attachment of fullAttachments.slice(1)) {
      expect(
        screen.getByText(`${attachment.filename} attachment`),
      ).toBeInTheDocument();
    }
  });

  it("should call remove attachment method", async () => {
    renderWithProviders(
      <ScriptFormAttachments {...props} initialAttachments={fullAttachments} />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: `Remove ${fullAttachments[0].filename} attachment`,
      }),
    );

    expect(onInitialAttachmentDelete).toHaveBeenCalledWith(
      fullAttachments[0].filename,
    );
  });

  it("should call remove attachment method", () => {
    renderWithProviders(
      <ScriptFormAttachments
        {...props}
        initialAttachments={fullAttachments}
        attachmentsToRemove={fullAttachments
          .slice(0, 1)
          .map((attachment) => attachment.filename)}
      />,
    );

    expect(getFileInputError).toHaveBeenCalledWith(fullAttachments[0].filename);
    expect(onFileInputChange).toHaveBeenCalledWith(fullAttachments[0].filename);
  });
});
