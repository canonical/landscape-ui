import { fireEvent, screen } from "@testing-library/react";
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

  it("shows help text when a file is present", () => {
    const file = new File(["content"], "helped.txt", { type: "text/plain" });

    renderWithProviders(
      <FileInput
        help="Only text files are allowed"
        value={file}
        onFileUpload={vi.fn()}
        onFileRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Only text files are allowed")).toBeInTheDocument();
  });

  it("does not call onFileUpload when no files are selected", () => {
    const onFileUpload = vi.fn();

    renderWithProviders(
      <FileInput
        label="Upload script"
        value={null}
        onFileUpload={onFileUpload}
        onFileRemove={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Upload script"), {
      target: { files: null },
    });

    expect(onFileUpload).not.toHaveBeenCalled();
  });

  it("uploads selected file and triggers onBlur callback", async () => {
    const user = userEvent.setup();
    const onFileUpload = vi.fn().mockResolvedValue(undefined);
    const onBlur = vi.fn();
    const file = new File(["script"], "script.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(
      <FileInput
        label="Upload script"
        value={null}
        onFileUpload={onFileUpload}
        onFileRemove={vi.fn()}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByLabelText("Upload script");
    await user.click(input);
    await user.upload(input, file);

    expect(onFileUpload).toHaveBeenCalledWith([file]);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uploads selected file when onBlur is not provided", async () => {
    const user = userEvent.setup();
    const onFileUpload = vi.fn().mockResolvedValue(undefined);
    const file = new File(["script"], "script.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(
      <FileInput
        label="Upload script"
        value={null}
        onFileUpload={onFileUpload}
        onFileRemove={vi.fn()}
      />,
    );

    await user.upload(screen.getByLabelText("Upload script"), file);

    expect(onFileUpload).toHaveBeenCalledWith([file]);
  });
});
