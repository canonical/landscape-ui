import * as Constants from "@/constants";
import { APP_COMMIT, APP_VERSION } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AboutPage from "./AboutPage";

vi.mock("@/hooks/useEnv");

describe("AboutPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders version details", () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      packageVersion: "1.2.3",
      revision: "abcdef",
    });

    const { container } = renderWithProviders(<AboutPage />);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(container).toHaveInfoItem(
      "UI version",
      `${APP_VERSION} (${APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"})`,
    );
    expect(container).toHaveInfoItem("Server version", "1.2.3 (abcdef)");
  });

  it("falls back to unknown when UI version or hash are unavailable", () => {
    vi.spyOn(Constants, "APP_VERSION", "get").mockReturnValue("");
    vi.spyOn(Constants, "APP_COMMIT", "get").mockReturnValue("");
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      packageVersion: "1.2.3",
      revision: "abcdef",
    });

    const { container } = renderWithProviders(<AboutPage />);

    expect(container).toHaveInfoItem("UI version", "unknown (unknown)");
  });

  it("falls back to unknown when server package version or revision are unavailable", () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      packageVersion: "",
      revision: "",
    });

    const { container } = renderWithProviders(<AboutPage />);

    expect(container).toHaveInfoItem("Server version", "unknown (unknown)");
  });

  it("shows a loading state while env details are being fetched", () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: true,
    });

    renderWithProviders(<AboutPage />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(screen.queryByText("Server version")).not.toBeInTheDocument();
  });
});
