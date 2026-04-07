import { setEndpointStatus } from "@/tests/controllers/controller";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it } from "vitest";
import RunScriptForm from "./RunScriptForm";

const [script] = scripts;

const selectTag = async (
  user: ReturnType<typeof userEvent.setup>,
  tagName: string,
) => {
  await user.click(await screen.findByRole("combobox", { name: "Tags" }));
  await user.click(await screen.findByRole("checkbox", { name: tagName }));
};

describe("RunScriptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should display run script form", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    expect(await screen.findByText(/run script/i)).toBeInTheDocument();

    const tagsRadio = screen.getByRole("radio", {
      name: /tags/i,
    });

    const instanceIdsRadio = screen.getByRole("radio", {
      name: /instance names/i,
    });

    expect(tagsRadio).toBeInTheDocument();
    expect(instanceIdsRadio).toBeInTheDocument();

    expect(tagsRadio).toBeChecked();
    expect(instanceIdsRadio).not.toBeChecked();

    expect(screen.getByText(/select tags/i)).toBeInTheDocument();
    expect(screen.getByText(/run as user/i)).toBeInTheDocument();
    expect(screen.getByText("Time limit (seconds)")).toBeInTheDocument();
    expect(screen.getByText(/delivery time/i)).toBeInTheDocument();
  });

  it("should display instance names when instance names radio is checked", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    const instanceIdsRadio = await screen.findByRole("radio", {
      name: /instance names/i,
    });

    await user.click(instanceIdsRadio);

    expect(screen.getByText("Select instances")).toBeInTheDocument();
  });

  it("should display the code editor with its label", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    expect(await screen.findByText(/script code/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-monaco")).toBeInTheDocument();
  });

  it("should change submit button label to 'Save and run' when code is modified", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    await screen.findByRole("button", { name: /run script/i });

    const codeEditor = screen.getByTestId("mock-monaco");
    await user.clear(codeEditor);
    await user.type(codeEditor, "#!/bin/bash\necho hello");

    expect(
      screen.getByRole("button", { name: /save and run/i }),
    ).toBeInTheDocument();
  });

  it("should show the edit confirmation modal when code is modified and submit is clicked", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    await selectTag(user, "appservers");

    const codeEditor = screen.getByTestId("mock-monaco");
    await user.clear(codeEditor);
    await user.type(codeEditor, "#!/bin/bash\necho hello");

    expect(
      await screen.findByRole("button", { name: /save and run/i }),
    ).not.toHaveAttribute("aria-disabled", "true");

    await user.click(screen.getByRole("button", { name: /save and run/i }));

    expect(
      await screen.findByText(/submit new version of/i),
    ).toBeInTheDocument();
  });

  it("should run the script without showing the edit confirmation modal when code is not modified", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    await selectTag(user, "appservers");

    expect(
      await screen.findByRole("button", { name: /run script/i }),
    ).not.toHaveAttribute("aria-disabled", "true");

    await user.click(screen.getByRole("button", { name: /run script/i }));

    expect(
      screen.queryByText(/submit new version of/i),
    ).not.toBeInTheDocument();

    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Run script" }),
    );

    expect(
      await screen.findByText(/script execution queued/i),
    ).toBeInTheDocument();
  });

  it("should call editScript before runScript when submitting with modified code", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    await selectTag(user, "appservers");

    const codeEditor = screen.getByTestId("mock-monaco");
    await user.clear(codeEditor);
    await user.type(codeEditor, "#!/bin/bash\necho hello");

    expect(
      await screen.findByRole("button", { name: /save and run/i }),
    ).not.toHaveAttribute("aria-disabled", "true");

    await user.click(screen.getByRole("button", { name: /save and run/i }));

    const editConfirmButton = await screen.findByRole("button", {
      name: "Submit and run",
    });
    await user.click(editConfirmButton);

    const runConfirmButton = await screen.findByRole("button", {
      name: "Run script",
    });

    expect(runConfirmButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(runConfirmButton);

    expect(
      await screen.findByText(/script execution queued/i),
    ).toBeInTheDocument();
  });

  it("should show 'no instances to run script on' modal when submitting with tags that have no script-capable instances", async () => {
    const scriptWithoutTaggedInstances = {
      ...script,
      access_group: "empty-access-group access-group:empty-access-group",
    };

    renderWithProviders(
      <RunScriptForm script={scriptWithoutTaggedInstances} />,
    );

    await selectTag(user, "appservers");

    const runButton = await screen.findByRole("button", {
      name: /run script/i,
    });

    await user.click(runButton);

    expect(
      await screen.findByText(/no instances to run script on/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please select different tags and try again/i),
    ).toBeInTheDocument();
  });

  it("should show instance list and confirmation message in run modal when tags have script-capable instances", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    await selectTag(user, "appservers");

    const runButton = await screen.findByRole("button", {
      name: /run script/i,
    });
    expect(runButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(runButton);

    expect(
      await screen.findByText(
        /this script will run on the following instances/i,
      ),
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("columnheader", { name: /instance/i }),
    ).toBeInTheDocument();
  });

  it("should show warning notification on tag blur when selected tags have no associated instances", async () => {
    const scriptWithoutTaggedInstances = {
      ...script,
      access_group: "empty-access-group access-group:empty-access-group",
    };

    renderWithProviders(
      <RunScriptForm script={scriptWithoutTaggedInstances} />,
    );

    await selectTag(user, "appservers");

    // Click another input to close the dropdown and trigger the onClose callback,
    // which sets hasClosedTagDropdown=true (required to display the warning).
    await user.click(screen.getByRole("textbox", { name: /run as user/i }));

    expect(
      await screen.findByText(
        "There are no instances with the selected tags that can run scripts.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/this script will run on the following instances/i),
    ).not.toBeInTheDocument();
  });
});
