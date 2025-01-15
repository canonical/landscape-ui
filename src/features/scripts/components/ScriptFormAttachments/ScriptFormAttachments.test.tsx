import { render, screen } from "@testing-library/react";
import ScriptFormAttachments from "./ScriptFormAttachments";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

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

  const fullAttachments = Object.keys(props.attachments);

  it("should render file inputs only", () => {
    render(<ScriptFormAttachments {...props} />);

    for (const key in props.attachments) {
      expect(
        screen.queryByRole("button", { name: `Remove ${key} attachment` }),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText(`${key} attachment`)).toBeInTheDocument();
    }
  });

  it("should render remove buttons only", () => {
    render(
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
    render(
      <ScriptFormAttachments
        {...props}
        attachmentsToRemove={fullAttachments.slice(0, 2)}
        initialAttachments={fullAttachments}
      />,
    );

    for (const initialAttachment of fullAttachments.slice(2)) {
      expect(
        screen.getByLabelText(`Remove ${initialAttachment} attachment`),
      ).toBeInTheDocument();
    }

    for (const key of fullAttachments.slice(0, 2)) {
      expect(screen.getByText(`${key} attachment`)).toBeInTheDocument();
    }
  });

  it("should render single remove button and several file inputs", () => {
    render(
      <ScriptFormAttachments
        {...props}
        initialAttachments={fullAttachments.slice(-1)}
      />,
    );

    expect(
      screen.getByLabelText(
        `Remove ${fullAttachments[fullAttachments.length - 1]} attachment`,
      ),
    ).toBeInTheDocument();

    for (const key of fullAttachments.slice(1)) {
      expect(screen.getByText(`${key} attachment`)).toBeInTheDocument();
    }
  });

  it("should call remove attachment method", async () => {
    render(
      <ScriptFormAttachments {...props} initialAttachments={fullAttachments} />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: `Remove ${fullAttachments[0]} attachment`,
      }),
    );

    expect(onInitialAttachmentDelete).toHaveBeenCalledWith(fullAttachments[0]);
  });

  it("should call remove attachment method", () => {
    render(
      <ScriptFormAttachments
        {...props}
        initialAttachments={fullAttachments}
        attachmentsToRemove={fullAttachments.slice(0, 1)}
      />,
    );

    expect(getFileInputError).toHaveBeenCalledWith(fullAttachments[0]);
    expect(onFileInputChange).toHaveBeenCalledWith(fullAttachments[0]);
  });
});
