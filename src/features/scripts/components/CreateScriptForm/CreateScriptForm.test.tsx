import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, vi } from "vitest";
import CreateScriptForm from "./CreateScriptForm";

describe("CreateScriptForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should display add script form", async () => {
    renderWithProviders(<CreateScriptForm />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/code/i, undefined, { timeout: 5000 }),
    ).toBeInTheDocument();

    expect(screen.getByText("Access group")).toBeInTheDocument();
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/add script/i)).toBeInTheDocument();
  });

  it("populates title and code from an uploaded file", async () => {
    const user = userEvent.setup();
    const file = new File(["echo hello"], "bootstrap.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(<CreateScriptForm />);

    await user.upload(screen.getByTestId("create-script-upload-input"), file);

    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      "bootstrap",
    );
    expect(screen.getByTestId("mock-monaco")).toHaveValue("echo hello");
  });

  it("keeps entered title when uploading a file", async () => {
    const user = userEvent.setup();
    const file = new File(["echo from file"], "new-title.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(<CreateScriptForm />);

    const titleInput = screen.getByRole("textbox", { name: "Title" });
    await user.type(titleInput, "custom title");

    await user.upload(screen.getByTestId("create-script-upload-input"), file);

    expect(titleInput).toHaveValue("custom title");
    expect(screen.getByTestId("mock-monaco")).toHaveValue("echo from file");
  });

  it("shows required field validation on empty submit", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateScriptForm />);

    await user.click(screen.getByRole("button", { name: "Add script" }));

    expect(await screen.findAllByText("This field is required")).toHaveLength(
      2,
    );
  });

  it("uploads attachments in form inputs", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateScriptForm />);

    await user.upload(
      screen.getByLabelText("first attachment"),
      new File(["print('hello')"], "first.py", { type: "text/plain" }),
    );

    expect(screen.getByLabelText("first attachment")).toHaveValue(
      "C:\\fakepath\\first.py",
    );
  });

  it("submits script with attachments", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateScriptForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "My script",
    );
    await user.type(screen.getByTestId("mock-monaco"), "echo run");
    await user.upload(
      screen.getByLabelText("first attachment"),
      new File(["attachment"], "notes.txt", { type: "text/plain" }),
    );

    await user.click(screen.getByRole("button", { name: "Add script" }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits script without attachments", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateScriptForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "My script",
    );
    await user.type(screen.getByTestId("mock-monaco"), "echo run");
    await user.click(screen.getByRole("button", { name: "Add script" }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("shows error notification when create script fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "CreateScript" });
    renderWithProviders(<CreateScriptForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "My script",
    );
    await user.type(screen.getByTestId("mock-monaco"), "echo run");
    await user.click(screen.getByRole("button", { name: "Add script" }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows error notification when create script attachment fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "CreateScriptAttachment" });
    renderWithProviders(<CreateScriptForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "My script",
    );
    await user.type(screen.getByTestId("mock-monaco"), "echo run");
    await user.upload(
      screen.getByLabelText("first attachment"),
      new File(["attachment"], "notes.txt", { type: "text/plain" }),
    );
    await user.click(screen.getByRole("button", { name: "Add script" }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("ignores empty file upload input", async () => {
    renderWithProviders(<CreateScriptForm />);

    fireEvent.change(screen.getByTestId("create-script-upload-input"), {
      target: { files: null },
    });

    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("");
  });

  it("handles attachment input with no file selected", () => {
    renderWithProviders(<CreateScriptForm />);

    fireEvent.change(screen.getByLabelText("first attachment"), {
      target: { files: [] },
    });

    expect(screen.getByLabelText("first attachment")).toHaveValue("");
  });

  it("opens hidden file input from populate button", async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
    renderWithProviders(<CreateScriptForm />);

    await user.click(
      screen.getByRole("button", { name: "Populate from file" }),
    );

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
