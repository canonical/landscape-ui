import { API_URL_OLD } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { isAction } from "@/tests/server/handlers/_helpers";
import { ErrorBoundary } from "@sentry/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import EditAccessGroupSidePanel from "./EditAccessGroupSidePanel";

const childGroup = accessGroups.find((group) => group.parent);
assert(childGroup, "Mocks must include an access group with a parent");
const parentGroup = accessGroups.find(
  (group) => group.name === childGroup.parent,
);
assert(parentGroup, "Mocks must include the parent of the child access group");

const renderWithBoundary = (name: string) =>
  renderWithProviders(
    <ErrorBoundary fallback={({ error }) => <p>{(error as Error).message}</p>}>
      <EditAccessGroupSidePanel />
    </ErrorBoundary>,
    undefined,
    `/?name=${name}`,
  );

describe("EditAccessGroupSidePanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders a loading state while the access group is being fetched", () => {
    renderWithProviders(<EditAccessGroupSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the form with the access group header and parent title", async () => {
    renderWithBoundary(childGroup.name);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: `Edit ${childGroup.title}` }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      childGroup.title,
    );
    expect(await screen.findByText(parentGroup.title)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("falls back to the raw parent name when the parent group is unavailable", async () => {
    // Resolve the child group itself, but never its parent, so the parent
    // title lookup returns nothing and the component falls back to the name.
    server.use(
      http.get(API_URL_OLD, ({ request }) => {
        if (!isAction(request, "GetAccessGroups")) {
          return;
        }

        const requestedName = new URL(request.url).searchParams.get("names.1");

        const response = accessGroups.filter(
          (group) =>
            group.name === requestedName && group.name !== childGroup.parent,
        );

        return HttpResponse.json(response);
      }),
    );

    renderWithBoundary(childGroup.name);

    await expectLoadingState();

    expect(screen.getByText("Parent")).toBeInTheDocument();
    expect(screen.getByText(childGroup.parent)).toBeInTheDocument();
    expect(screen.queryByText(parentGroup.title)).not.toBeInTheDocument();
  });

  it("shows a validation error when the title is empty", async () => {
    renderWithBoundary(childGroup.name);

    await expectLoadingState();

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await userEvent.clear(titleInput);
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText("This field is required"),
    ).toBeInTheDocument();
  });

  it("submits the form and shows a success notification", async () => {
    renderWithBoundary(childGroup.name);

    await expectLoadingState();

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Group");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText("You have successfully edited Updated Group"),
    ).toBeInTheDocument();
  });

  it("shows an error notification when editing the access group fails", async () => {
    renderWithBoundary(childGroup.name);

    await expectLoadingState();

    setEndpointStatus({ status: "error", path: "access-groups/:name" });

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText(/the endpoint status is set to "error"/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(`You have successfully edited`),
    ).not.toBeInTheDocument();
  });

  it("throws when the access group cannot be found", async () => {
    setEndpointStatus({ status: "empty", path: "GetAccessGroups" });

    renderWithBoundary(childGroup.name);

    expect(
      await screen.findByText("Access group not found"),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("throws when the access group request fails", async () => {
    setEndpointStatus({ status: "error", path: "GetAccessGroups" });

    renderWithBoundary(childGroup.name);

    expect(
      await screen.findByText(/request failed with status code 500/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", { name: /title/i }),
    ).not.toBeInTheDocument();
  });
});
