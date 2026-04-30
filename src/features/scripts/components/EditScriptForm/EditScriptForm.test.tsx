import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import EditScriptForm from "./EditScriptForm";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { ROUTES } from "@/libs/routes";

const [script] = scripts;
const ASSOCIATED_PROFILE_ID = 12;

const props: ComponentProps<typeof EditScriptForm> = {
  script,
  onBack: vi.fn(),
};

describe("EditScriptForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should display edit script form", async () => {
    renderWithProviders(<EditScriptForm {...props} />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/code/i)).toBeInTheDocument();
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/submit new version/i)).toBeInTheDocument();
  });

  it("should show the edit confirmation modal when 'Submit new version' is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<EditScriptForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: /title/i }), " edited");
    await user.click(
      screen.getByRole("button", { name: /submit new version/i }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: /submit new version/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit the new version and show a success notification", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditScriptForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: /title/i }), " edited");
    await user.click(
      screen.getByRole("button", { name: /submit new version/i }),
    );

    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: /submit new version/i,
      }),
    );

    expect(
      await screen.findByText(/successfully submitted a new version/i),
    ).toBeInTheDocument();
  });

  it("populates title and code from an uploaded file when title is empty", async () => {
    const user = userEvent.setup();
    const editableScript = { ...script, title: "" };
    const file = new File(["echo from upload"], "deploy.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(<EditScriptForm script={editableScript} />);

    const fileInput = screen.getByTestId("edit-script-upload-input");

    await user.upload(fileInput, file);

    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      "deploy",
    );
    expect(screen.getByTestId("mock-monaco")).toHaveValue("echo from upload");
  });

  it("keeps existing title when uploading a file", async () => {
    const user = userEvent.setup();
    const file = new File(["echo from upload"], "should-not-replace.sh", {
      type: "text/x-shellscript",
    });

    renderWithProviders(<EditScriptForm script={script} />);

    const titleInput = screen.getByRole("textbox", { name: "Title" });
    const existingTitle = titleInput.getAttribute("value");

    const fileInput = screen.getByTestId("edit-script-upload-input");
    await user.upload(fileInput, file);

    expect(titleInput).toHaveValue(existingTitle);
    expect(screen.getByTestId("mock-monaco")).toHaveValue("echo from upload");
  });

  it("updates code editor value", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditScriptForm script={script} />);

    const editor = screen.getByTestId("mock-monaco");
    await user.clear(editor);
    await user.type(editor, "echo changed");

    expect(editor).toHaveValue("echo changed");
  });

  it("submits new version with attachment changes", async () => {
    const user = userEvent.setup();
    const scriptWithAttachment = scripts.find(
      (entry) => entry.attachments.length,
    );
    assert(scriptWithAttachment);
    const [initialAttachment] = scriptWithAttachment.attachments;
    assert(initialAttachment);

    renderWithProviders(<EditScriptForm script={scriptWithAttachment} />);

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${initialAttachment.filename} attachment`,
      }),
    );

    await user.upload(
      screen.getByLabelText("second attachment"),
      new File(["new attachment"], "new.txt", { type: "text/plain" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );

    const dialog = screen.getByRole("dialog", {
      name: `Submit new version of "${scriptWithAttachment.title}"`,
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Submit new version" }),
    );

    expect(screen.queryByText("Network Error")).not.toBeInTheDocument();
  });

  it("opens hidden file input from populate button", async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Populate from file" }),
    );

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("ignores empty file upload input", async () => {
    renderWithProviders(<EditScriptForm script={script} />);

    fireEvent.change(screen.getByTestId("edit-script-upload-input"), {
      target: { files: null },
    });

    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      script.title,
    );
  });

  it("handles attachment input with no file selected", () => {
    renderWithProviders(<EditScriptForm script={script} />);

    fireEvent.change(screen.getByLabelText("first attachment"), {
      target: { files: [] },
    });

    expect(screen.getByLabelText("first attachment")).toHaveValue("");
  });

  it("submits new version with associated profiles links", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );

    expect(
      await screen.findByText(
        /submitting these changes will affect the following profiles/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "abc" })).toHaveAttribute(
      "href",
      ROUTES.scripts.root({ tab: "profiles" }),
    );
    expect(screen.getByRole("link", { name: "12 instances" })).toHaveAttribute(
      "href",
      ROUTES.instances.root(),
    );
  });

  it("renders singular associated instance link text", async () => {
    const user = userEvent.setup();
    const modifiedProfiles = scriptProfiles.map((profile) =>
      profile.id === ASSOCIATED_PROFILE_ID
        ? { ...profile, computers: { num_associated_computers: 1 } }
        : profile,
    );
    server.use(
      http.get(`${API_URL}scripts/:id/script-profiles`, () =>
        HttpResponse.json({
          results: modifiedProfiles,
          count: modifiedProfiles.length,
          next: null,
          previous: null,
        }),
      ),
    );

    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );

    const instanceLinks = await screen.findAllByRole("link", {
      name: "1 instance",
    });
    expect(instanceLinks[0]).toHaveAttribute("href", ROUTES.instances.root());
  });

  it("shows no data for associated profiles without instances", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditScriptForm
        script={{
          ...script,
          script_profiles: [{ id: 999, title: "Unknown profile" }],
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("submits when there are no associated profiles", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "empty", path: "script-profiles" });
    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );

    expect(
      await screen.findByText(
        /all future script runs will be done using the latest version of the code\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/affect the following profiles/i),
    ).not.toBeInTheDocument();
  });

  it("closes confirmation modal with cancel button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows error notification when edit script fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "EditScript" });
    renderWithProviders(<EditScriptForm script={script} />);

    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Submit new version" }),
    );

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows error notification when removing attachment fails", async () => {
    const user = userEvent.setup();
    const scriptWithAttachment = scripts.find(
      (entry) => entry.attachments.length,
    );
    assert(scriptWithAttachment);
    const [initialAttachment] = scriptWithAttachment.attachments;
    assert(initialAttachment);
    setEndpointStatus({ status: "error", path: "RemoveScriptAttachment" });
    renderWithProviders(<EditScriptForm script={scriptWithAttachment} />);

    await user.click(
      screen.getByRole("button", {
        name: `Remove ${initialAttachment.filename} attachment`,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Submit new version" }),
    );

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows error notification when adding attachment fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "CreateScriptAttachment" });
    renderWithProviders(<EditScriptForm script={script} />);

    await user.upload(
      screen.getByLabelText("first attachment"),
      new File(["new attachment"], "new.txt", { type: "text/plain" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit new version" }),
    );
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Submit new version" }),
    );

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
