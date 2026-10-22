import { API_URL } from "@/constants";
import { getFeatures } from "@/features/instances";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { Instance } from "@/types/Instance";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import RunScriptForm from "./RunScriptForm";
import {
  INSTANCE_OPTIONS_LIMIT,
  TAGGED_INSTANCES_PREVIEW_LIMIT,
} from "./constants";

const [script] = scripts;
const INSTANCES_OVER_PICKER_LIMIT = 500;

// Captures every request to the computers endpoint so tests can assert on
// the pagination and query each one carries.
const captureInstanceRequests = (count: number = instances.length) => {
  const requests: URL[] = [];

  server.use(
    http.get(`${API_URL}computers`, ({ request }) => {
      const url = new URL(request.url);
      requests.push(url);

      return HttpResponse.json({
        ...generatePaginatedResponse<Instance>({
          data: instances,
          limit: Number(url.searchParams.get("limit")) || instances.length,
          offset: Number(url.searchParams.get("offset")) || 0,
        }),
        count,
      });
    }),
  );

  return requests;
};

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
      screen.getByText(/select different tags and try again/i),
    ).toBeInTheDocument();
  });

  it("should show instance list and confirmation message in run modal when tags have script-capable instances", async () => {
    // The real server excludes Windows hosts from the preview query; the mock
    // does not, so report the script-capable count to keep the preview whole.
    captureInstanceRequests(
      instances.filter((instance) => getFeatures(instance).scripts).length,
    );

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
    expect(
      within(dialog).queryByText(/of them are listed below/i),
    ).not.toBeInTheDocument();
  });

  it("should show the total target count when the run modal lists only a preview of the matching instances", async () => {
    const scriptCapableInstances = instances
      .filter((instance) => getFeatures(instance).scripts)
      .slice(0, 2);
    const matchingInstancesCount = 1234;

    setEndpointStatus({
      status: "variant",
      path: "computers",
      response: {
        count: matchingInstancesCount,
        results: scriptCapableInstances,
        next: null,
        previous: null,
      },
    });

    renderWithProviders(<RunScriptForm script={script} />);

    await selectTag(user, "appservers");

    await user.click(
      await screen.findByRole("button", { name: /run script/i }),
    );

    const dialog = await screen.findByRole("dialog");

    expect(
      within(dialog).getByText(
        new RegExp(
          `matches ${matchingInstancesCount.toLocaleString()} instances that can run scripts`,
          "i",
        ),
      ),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        new RegExp(
          `only ${scriptCapableInstances.length} of them are listed below`,
          "i",
        ),
      ),
    ).toBeInTheDocument();
    scriptCapableInstances.forEach(({ title }) => {
      expect(within(dialog).getByText(title)).toBeInTheDocument();
    });
  });

  it("should ignore the page's URL pagination and fetch the instance list only in instance names mode", async () => {
    const requests = captureInstanceRequests();

    renderWithProviders(
      <RunScriptForm script={script} />,
      undefined,
      "/scripts?page=3&pageSize=50",
    );

    await selectTag(user, "appservers");
    await user.click(
      await screen.findByRole("button", { name: /run script/i }),
    );
    const dialog = await screen.findByRole("dialog");

    const previewRequest = requests.find((url) =>
      url.searchParams.get("query")?.includes("tag:appservers"),
    );
    expect(previewRequest?.searchParams.get("limit")).toBe(
      String(TAGGED_INSTANCES_PREVIEW_LIMIT),
    );
    expect(previewRequest?.searchParams.has("offset")).toBe(false);

    const pickerLimit = String(INSTANCE_OPTIONS_LIMIT);
    expect(
      requests.some((url) => url.searchParams.get("limit") === pickerLimit),
    ).toBe(false);

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("radio", { name: /instance names/i }));
    await screen.findByText("Select instances");

    const pickerRequest = requests.find(
      (url) => url.searchParams.get("limit") === pickerLimit,
    );
    expect(pickerRequest).toBeDefined();
    expect(pickerRequest?.searchParams.has("offset")).toBe(false);

    requests.forEach((url) => {
      expect(url.searchParams.get("offset")).not.toBe("100");
      expect(url.searchParams.get("limit")).not.toBe("50");
    });
  });

  it("should tell the user when the instance picker is capped", async () => {
    const instancesCount = INSTANCE_OPTIONS_LIMIT + INSTANCES_OVER_PICKER_LIMIT;
    captureInstanceRequests(instancesCount);

    renderWithProviders(<RunScriptForm script={script} />);

    await user.click(
      await screen.findByRole("radio", { name: /instance names/i }),
    );

    expect(
      await screen.findByText(
        new RegExp(
          `only the first ${INSTANCE_OPTIONS_LIMIT.toLocaleString()} of the ${instancesCount.toLocaleString()} instances`,
          "i",
        ),
      ),
    ).toBeInTheDocument();
  });

  it("should not mention a cap when the instance picker lists every instance", async () => {
    captureInstanceRequests();

    renderWithProviders(<RunScriptForm script={script} />);

    await user.click(
      await screen.findByRole("radio", { name: /instance names/i }),
    );
    await screen.findByText("Select instances");

    expect(screen.queryByText(/only the first/i)).not.toBeInTheDocument();
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
