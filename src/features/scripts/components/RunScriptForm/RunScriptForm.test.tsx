import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
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

  it("should show warning notification on tag blur when selected tags have no associated instances", async () => {
    const scriptWithoutTaggedInstances = {
      ...script,
      access_group: "empty-access-group access-group:empty-access-group",
    };

    renderWithProviders(
      <RunScriptForm script={scriptWithoutTaggedInstances} />,
    );

    await selectTag(user, "appservers");

    const tagsCombobox = screen.getByRole("combobox", { name: "Tags" });
    const runAsUserInput = screen.getByRole("textbox", {
      name: /run as user/i,
    });

    tagsCombobox.focus();
    fireEvent.blur(tagsCombobox, { relatedTarget: runAsUserInput });

    expect(
      await screen.findByText(
        "There are no instances associated with those tags, please select a different set of tags to continue.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/this script will run on the following instances/i),
    ).not.toBeInTheDocument();
  });
});
