import { renderWithProviders } from "@/tests/render";
import GeneralSettings from "./GeneralSettings";
import { describe } from "vitest";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import useEnv from "@/hooks/useEnv";
import { expectLoadingState } from "@/tests/helpers";
import { userDetails } from "@/tests/mocks/user";
import { screen } from "@testing-library/react";

describe("GeneralSettings", () => {
  vi.mock("@/hooks/useAuth");
  vi.mock("@/hooks/useEnv");

  it("should show user info instead of user edit form and no helper content", async () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      user: { ...authUser, has_password: false },
    });
    vi.mocked(useEnv, { partial: true }).mockReturnValue({ isSaas: false });

    const { container } = renderWithProviders(<GeneralSettings />);

    await expectLoadingState();

    expect(screen.getByText("General")).toBeInTheDocument();

    expect(container).toHaveInfoItem("Name", userDetails.name);
    expect(container).toHaveInfoItem("Email", userDetails.email);

    expect(
      screen.queryByRole("textbox", { name: /name/i }),
    ).not.toBeInTheDocument();

    expect(screen.queryByText("listed from")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /ubuntu one/i }),
    ).not.toBeInTheDocument();
  });

  it("should show user info instead of user edit form and a helper content", async () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      user: { ...authUser, has_password: false },
    });
    vi.mocked(useEnv, { partial: true }).mockReturnValue({ isSaas: true });

    const { container } = renderWithProviders(<GeneralSettings />);

    await expectLoadingState();

    expect(screen.getByText("General")).toBeInTheDocument();

    expect(container).toHaveInfoItem("Name", userDetails.name);
    expect(container).toHaveInfoItem("Email", userDetails.email);

    expect(
      screen.queryByRole("textbox", { name: /name/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("listed from")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ubuntu one/i }),
    ).toBeInTheDocument();
  });

  it("should show user edit form without a helper content", async () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      user: authUser,
      setUser: vi.fn(),
    });
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      isSaas: false,
    });

    renderWithProviders(<GeneralSettings />);

    await expectLoadingState();

    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();

    expect(screen.queryByText("listed from")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /ubuntu one/i }),
    ).not.toBeInTheDocument();
  });

  it("should show user edit form with a helper content", async () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      user: authUser,
      setUser: vi.fn(),
    });
    vi.mocked(useEnv, { partial: true }).mockReturnValue({ isSaas: true });

    renderWithProviders(<GeneralSettings />);

    await expectLoadingState();

    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();

    const helperContentText = screen.getByText(/listed from/i);
    expect(helperContentText).toBeInTheDocument();

    expect(helperContentText.firstChild).toHaveTextContent("listed from");
    expect(helperContentText.lastChild).toHaveRole("link");
    expect(helperContentText.lastChild).toHaveTextContent("Ubuntu One");
  });
});
