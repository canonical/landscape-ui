import { setEndpointStatus } from "@/tests/controllers/controller";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { PATHS, ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditInstance from "./EditInstance";

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;
const routePath = ROUTES.instances.details.single(1);

describe("EditInstance", () => {
  it("renders editable fields and access group options", async () => {
    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(await screen.findByRole("textbox", { name: "Title" })).toHaveValue(
      "Application Server 1",
    );
    expect(
      screen.getByRole("combobox", { name: "Access group" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Global access" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Comment" })).toHaveValue(
      "my awesome instance comment",
    );
  });

  it("disables title editing for WSL instances", async () => {
    renderWithProviders(
      <EditInstance instance={{ ...ubuntuInstance, is_wsl_instance: true }} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      await screen.findByRole("textbox", { name: "Title" }),
    ).toBeDisabled();
  });

  it("shows tag confirmation modal when adding a new tag", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findByRole("textbox", { name: "Title" });

    await user.click(screen.getByPlaceholderText("Add tags"));
    await user.click(await screen.findByRole("button", { name: "asd" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        "Adding tags could trigger irreversible changes to your instances.",
      ),
    ).toBeInTheDocument();
  });

  it("submits directly when no tags were added", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    const titleInput = await screen.findByRole("textbox", { name: "Title" });
    await user.clear(titleInput);
    await user.type(titleInput, "Renamed instance");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Instance updated")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Adding tags could trigger irreversible changes to your instances.",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add tags" }),
    ).not.toBeInTheDocument();
  });

  it("submits from tag confirmation modal", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findByRole("textbox", { name: "Title" });
    await user.click(screen.getByPlaceholderText("Add tags"));
    await user.click(await screen.findByRole("button", { name: "asd" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await user.click(await screen.findByRole("button", { name: "Add tags" }));

    expect(await screen.findByText("Instance updated")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add tags" }),
    ).not.toBeInTheDocument();
  });

  it("shows error notification when edit fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "editInstance" });

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findByRole("textbox", { name: "Title" });
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows endpoint error when profile-diff request fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "tags/profile-diff" });

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findByRole("textbox", { name: "Title" });
    await user.click(screen.getByPlaceholderText("Add tags"));
    await user.click(await screen.findByRole("button", { name: "asd" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("submits directly when profile-diff result is empty", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "empty", path: "tags/profile-diff" });

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findByRole("textbox", { name: "Title" });
    await user.click(screen.getByPlaceholderText("Add tags"));
    await user.click(await screen.findByRole("button", { name: "asd" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Instance updated")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Adding tags could trigger irreversible changes to your instances.",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders when access groups request fails", async () => {
    setEndpointStatus({ status: "error", path: "GetAccessGroups" });

    renderWithProviders(
      <EditInstance instance={ubuntuInstance} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      await screen.findByRole("combobox", { name: "Access group" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Global access" }),
    ).not.toBeInTheDocument();
  });
});
