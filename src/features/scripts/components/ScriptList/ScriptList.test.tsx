import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import ScriptList from "./ScriptList";

const props: ComponentProps<typeof ScriptList> = {
  scripts: scripts,
};

const activeScript = scripts.find((script) => script.status === "ACTIVE");
const inactiveScript = scripts.find((script) => script.status !== "ACTIVE");

vi.mock("@/hooks/useAuth");

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: () => true,
  hasAccounts: true,
};

const authContextValuesWithoutFeatureFlag: AuthContextProps = {
  ...authContextValues,
  isFeatureEnabled: () => false,
};

describe("ScriptList", () => {
  const user = userEvent.setup();
  assert(activeScript);
  assert(inactiveScript);

  it("should render profile list with feature flag enabled", async () => {
    vi.mocked(useAuth).mockReturnValue(authContextValues);
    const { container } = renderWithProviders(<ScriptList {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Status",
      "Access group",
      "Associated profiles",
      "Created",
      "Last modified",
      "Actions",
    ]);
  });

  it("should render profile list without feature flag enabled", async () => {
    vi.mocked(useAuth).mockReturnValue(authContextValuesWithoutFeatureFlag);
    const { container } = renderWithProviders(<ScriptList {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Status",
      "Access group",
      "Created",
      "Last modified",
      "Actions",
    ]);

    expect(screen.queryByText("Associated profiles")).not.toBeInTheDocument();
  });

  it("should open sidepanel when clicking on the script", async () => {
    renderWithProviders(<ScriptList {...props} />);

    const script = await screen.findByRole("button", {
      name: `Show details of script ${scripts[0].title}`,
    });

    expect(script).toBeInTheDocument();

    await user.click(script);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
  });

  it("shows correct icons for script status", async () => {
    renderWithProviders(<ScriptList {...props} />);

    const activeScriptRow = screen.getByRole("row", {
      name: `${activeScript.title} script row`,
    });
    expect(activeScriptRow).toBeInTheDocument();

    const statusCell = within(activeScriptRow).getByRole("cell", {
      name: /status/i,
    });
    expect(statusCell).toBeInTheDocument();
    expect(statusCell).toHaveIcon("status-succeeded-small");

    const inactiveScriptRow = screen.getByRole("row", {
      name: `${inactiveScript.title} script row`,
    });
    expect(inactiveScriptRow).toBeInTheDocument();

    const inactiveStatusCell = within(inactiveScriptRow).getByRole("cell", {
      name: /status/i,
    });
    expect(inactiveStatusCell).toBeInTheDocument();
    expect(inactiveStatusCell).toHaveIcon("status-queued-small");
  });
});
