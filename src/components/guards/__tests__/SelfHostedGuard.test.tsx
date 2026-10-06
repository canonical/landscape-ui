import EnvError from "@/pages/EnvError";
import { EnvContext, type EnvContextState } from "@/context/env";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { SelfHostedGuard } from "../SelfHostedGuard";

describe("SelfHostedGuard", () => {
  const envState: EnvContextState = {
    envLoading: false,
    isSaas: true,
    isSelfHosted: false,
    packageVersion: "",
    revision: "",
    displayDisaStigBanner: false,
  };

  const renderWithRoutes = (value: EnvContextState) => {
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <EnvContext.Provider value={value}>
          <Routes>
            <Route
              path="/"
              element={
                <SelfHostedGuard>
                  <div>secret</div>
                </SelfHostedGuard>
              }
            />
            <Route path="/env-error" element={<EnvError />} />
          </Routes>
        </EnvContext.Provider>
      </MemoryRouter>,
    );
  };

  it("renders loading state while env is loading", () => {
    renderWithRoutes({
      ...envState,
      envLoading: true,
    });

    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(screen.queryByText("Environment Error")).not.toBeInTheDocument();
  });

  it("renders children when self hosted", () => {
    renderWithRoutes({
      ...envState,
      isSelfHosted: true,
      isSaas: false,
    });

    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(screen.queryByText("Environment Error")).not.toBeInTheDocument();
  });

  it("navigates away when not self hosted", () => {
    renderWithRoutes({
      ...envState,
    });

    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(screen.getByText("Environment Error")).toBeInTheDocument();
    expect(
      screen.getByText("This feature is not available in SaaS mode."),
    ).toBeInTheDocument();
  });
});
