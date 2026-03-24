import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import FileInput from "./FileInput";

describe("FileInput", () => {
  it("renders a file input when no value is provided", () => {
    renderWithProviders(
      <FileInput
        label="Upload file"
        value={null}
        onFileUpload={vi.fn()}
        onFileRemove={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Upload file")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload file")).toHaveAttribute(
      "type",
      "file",
    );
  });

  it("renders the filename and delete button when a file is provided", () => {
    const file = new File(["content"], "test-file.txt", { type: "text/plain" });

    renderWithProviders(
      <FileInput value={file} onFileUpload={vi.fn()} onFileRemove={vi.fn()} />,
    );

    expect(screen.getByText("test-file.txt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("calls onFileRemove when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onFileRemove = vi.fn().mockResolvedValue(undefined);
    const file = new File(["content"], "my-file.txt", { type: "text/plain" });

    renderWithProviders(
      <FileInput
        value={file}
        onFileUpload={vi.fn()}
        onFileRemove={onFileRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: /remove/i }));

    expect(onFileRemove).toHaveBeenCalledTimes(1);
  });

  it("shows an error message when error is provided alongside a file", () => {
    const file = new File(["content"], "bad-file.txt", { type: "text/plain" });

    renderWithProviders(
      <FileInput
        value={file}
        onFileUpload={vi.fn()}
        onFileRemove={vi.fn()}
        error="File is too large"
      />,
    );

    expect(screen.getByText("File is too large")).toBeInTheDocument();
  });

  it("shows the label when a file is present", () => {
    const file = new File(["content"], "labelled.txt", { type: "text/plain" });

    renderWithProviders(
      <FileInput
        label="Script file"
        value={file}
        onFileUpload={vi.fn()}
        onFileRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Script file")).toBeInTheDocument();
  });
});
