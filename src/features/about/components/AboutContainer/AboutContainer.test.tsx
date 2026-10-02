import { renderWithProviders } from "@/tests/render";
import useEnv from "@/hooks/useEnv";
import { PATHS } from "@/libs/routes";
import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AboutContainer from "./AboutContainer";
import * as Constants from "@/constants";
import { APP_COMMIT, APP_VERSION } from "@/constants";

vi.mock("@/hooks/useEnv");

describe("AboutContainer", () => {
  beforeEach(() => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      packageVersion: "1.2.3",
      revision: "abcdef",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the current year in the copyright notice", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-06-15T12:00:00Z"));

    renderWithProviders(<AboutContainer />);

    expect(
      screen.getByText("© 2031 Canonical Ltd.", { exact: false }),
    ).toBeInTheDocument();
  });

  it("renders version details", () => {
    const { container } = renderWithProviders(<AboutContainer />);

    expect(
      screen.getByRole("heading", { name: "UI version" }),
    ).toBeInTheDocument();
    expect(container).toHaveInfoItem("App version", APP_VERSION);
    expect(container).toHaveInfoItem(
      "UI hash",
      APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown",
    );
    expect(
      screen.getByRole("heading", { name: "Server version" }),
    ).toBeInTheDocument();
    expect(container).toHaveInfoItem("Package version", "1.2.3");
    expect(container).toHaveInfoItem("Revision", "abcdef");
  });

  it("renders useful external links", () => {
    renderWithProviders(<AboutContainer />);

    expect(
      screen.getByRole("link", { name: "Landscape documentation" }),
    ).toHaveAttribute("href", PATHS.external.documentation);
    expect(
      screen.getByRole("link", { name: "Support portal" }),
    ).toHaveAttribute("href", PATHS.external.support);
  });

  it("falls back to unknown when UI version or hash are unavailable", () => {
    vi.spyOn(Constants, "APP_VERSION", "get").mockReturnValue("");
    vi.spyOn(Constants, "APP_COMMIT", "get").mockReturnValue("");

    const { container } = renderWithProviders(<AboutContainer />);

    expect(container).toHaveInfoItem("App version", "unknown");
    expect(container).toHaveInfoItem("UI hash", "unknown");
  });

  it("falls back to unknown when server package version or revision are unavailable", () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      packageVersion: "",
      revision: "",
    });

    const { container } = renderWithProviders(<AboutContainer />);

    expect(container).toHaveInfoItem("Package version", "unknown");
    expect(container).toHaveInfoItem("Revision", "unknown");
  });

  it("shows a loading state while env details are being fetched", () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: true,
    });

    renderWithProviders(<AboutContainer />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(screen.queryByText("UI version")).not.toBeInTheDocument();
    expect(screen.queryByText("Server version")).not.toBeInTheDocument();
  });
});
