import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PATHS, ROUTES } from "@/libs/routes";
import ProcessesHeader from "./ProcessesHeader";

const props = {
  selectedPids: [],
  handleClearSelection: vi.fn(),
};

const SELECTED_PID = 123;
const INSTANCE_ID = 11;

describe("ProcessesHeader", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render ProcessesHeader correctly", () => {
    renderWithProviders(<ProcessesHeader {...props} />);

    const buttons = ["End process", "Kill process"];
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    buttons.forEach((button) => {
      expect(screen.getByRole("button", { name: button })).toBeInTheDocument();
    });
  });

  it("should write in search", async () => {
    renderWithProviders(<ProcessesHeader {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
  });

  it("should clear search box", async () => {
    renderWithProviders(<ProcessesHeader {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test");
    await userEvent.click(
      screen.getByRole("button", { name: /Clear search field/i }),
    );
    expect(searchBox).toHaveValue("");
  });

  it("disables process action buttons when no pids are selected", () => {
    renderWithProviders(
      <ProcessesHeader selectedPids={[]} handleClearSelection={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "End process" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Kill process" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("enables process action buttons when pids are selected", () => {
    renderWithProviders(
      <ProcessesHeader
        selectedPids={[SELECTED_PID]}
        handleClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "End process" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Kill process" })).toBeEnabled();
  });

  it("ends selected processes and clears selection", async () => {
    const user = userEvent.setup();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <ProcessesHeader
        selectedPids={[SELECTED_PID]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: "End process" }));

    expect(
      await screen.findByText(/Process successfully ended\./i),
    ).toBeInTheDocument();
    expect(handleClearSelection).toHaveBeenCalledTimes(1);
  });

  it("kills selected processes and clears selection", async () => {
    const user = userEvent.setup();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <ProcessesHeader
        selectedPids={[1, 2]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: "Kill process" }));

    expect(
      await screen.findByText(/Processes successfully killed\./i),
    ).toBeInTheDocument();
    expect(handleClearSelection).toHaveBeenCalledTimes(1);
  });

  it("shows error notification when ending process fails", async () => {
    const user = userEvent.setup();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <ProcessesHeader
        selectedPids={[SELECTED_PID]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "End process" }));

    await expectErrorNotification();
    expect(handleClearSelection).not.toHaveBeenCalled();
  });

  it("shows error notification when killing process fails", async () => {
    const user = userEvent.setup();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <ProcessesHeader
        selectedPids={[SELECTED_PID]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Kill process" }));

    await expectErrorNotification();
    expect(handleClearSelection).not.toHaveBeenCalled();
  });
});
