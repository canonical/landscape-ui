import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SavedSearchForm from "./SavedSearchForm";

vi.mock("@/hooks/useAuth");

vi.mock("@/components/filter/SearchQueryEditor", () => {
  return {
    default: ({
      label,
      value,
      onChange,
      onBlur,
      error,
    }: {
      label: string;
      value: string | undefined;
      onChange?: (value: string | undefined) => void;
      onBlur?: () => void;
      error?: string | false;
    }) => (
      <div>
        <label>
          {label}
          <textarea
            aria-label={label}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
          />
        </label>
        {error && <span>{error}</span>}
      </div>
    ),
  };
});

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn(() => false),
  hasAccounts: true,
};

describe("SavedSearchForm", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof SavedSearchForm> = {
    initialValues: {
      title: "",
      search: "",
    },
    onSubmit: vi.fn(),
    mode: "edit",
  };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authContextValues);
  });

  it("should render form with title and search query fields", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} mode="create" />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/search query/i)).toBeInTheDocument();
  });

  it("shows strict search error immediately for invalid initial search", () => {
    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        initialValues={{
          title: "Existing",
          search: "alert:compu ",
        }}
      />,
    );

    expect(
      screen.getByText('"alert" has invalid value "compu".'),
    ).toBeInTheDocument();
  });

  it("does not show search error initially when search is empty", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} />);

    expect(
      screen.queryByText("This field is required."),
    ).not.toBeInTheDocument();
  });

  it("uses relaxed validation while typing and strict on blur", async () => {
    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        mode="create"
        initialValues={{ title: "", search: "" }}
      />,
    );

    const searchTextarea = screen.getByLabelText(/search query/i);

    await user.type(searchTextarea, "alert:compu");

    expect(
      screen.queryByText('"alert" has invalid value "compu".'),
    ).not.toBeInTheDocument();

    await user.tab();

    expect(
      screen.getByText('"alert" has invalid value "compu".'),
    ).toBeInTheDocument();
  });

  it("blocks submit and shows search error when search is invalid (strict)", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        mode="create"
        initialValues={{
          title: "My search",
          search: "alert:compu",
        }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: "Add saved search",
    });

    await user.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();

    expect(
      screen.getByText('"alert" has invalid value "compu".'),
    ).toBeInTheDocument();
  });

  it("should render submit button with default text", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("should render submit button with custom text", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("should render disabled title field when editing (submitButtonText is 'Save changes')", () => {
    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        initialValues={{
          title: "Existing Title",
          search: "status:running",
        }}
      />,
    );

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByText(/search query/i)).toBeInTheDocument();
  });

  it("should render title field when creating (submitButtonText is not 'Save changes')", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} mode="create" />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/search query/i)).toBeInTheDocument();
  });

  it("should populate form with initial values", () => {
    const initialValues = {
      title: "Test Search",
      search: "status:running",
    };

    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        initialValues={initialValues}
        mode="create"
      />,
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue(initialValues.title);
  });

  it("should render back button when onBackButtonPress is provided", () => {
    const onBackButtonPress = vi.fn();

    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("should not render back button when onBackButtonPress is not provided", () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} />);

    expect(
      screen.queryByRole("button", { name: /back/i }),
    ).not.toBeInTheDocument();
  });

  it("should call onBackButtonPress when back button is clicked", async () => {
    const onBackButtonPress = vi.fn();

    renderWithProviders(
      <SavedSearchForm
        {...defaultProps}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    expect(onBackButtonPress).toHaveBeenCalled();
  });

  it("should update search field when typing", async () => {
    renderWithProviders(<SavedSearchForm {...defaultProps} mode="create" />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "Test Title");

    expect(titleInput).toHaveValue("Test Title");
  });

  describe("feature flag integration", () => {
    it("should validate profile:script queries when script-profiles feature is enabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn((key) => key === "script-profiles"),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:script:123 ",
          }}
        />,
      );

      const searchField = screen.getByLabelText(/search query/i);
      expect(searchField).toHaveValue("profile:script:123 ");
      expect(
        screen.queryByText(/invalid profile type/i),
      ).not.toBeInTheDocument();
    });

    it("should show error for profile:security queries when usg-profiles feature is disabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => false),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:security:1:pass ",
          }}
        />,
      );

      const searchField = screen.getByLabelText(/search query/i);
      expect(searchField).toHaveValue("profile:security:1:pass ");
      expect(
        screen.getByText('"profile" has invalid profile type "security".'),
      ).toBeInTheDocument();
    });

    it("should validate profile:wsl queries when wsl-child-instance-profiles feature is enabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn((key) => key === "wsl-child-instance-profiles"),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:wsl:1:compliant ",
          }}
        />,
      );

      const searchField = screen.getByLabelText(/search query/i);
      expect(searchField).toHaveValue("profile:wsl:1:compliant ");
      expect(
        screen.queryByText(/invalid profile type/i),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid.*status/i)).not.toBeInTheDocument();
    });

    it("should handle all features enabled correctly", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => true),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:script:1 AND profile:security:2:pass ",
          }}
        />,
      );

      const searchField = screen.getByLabelText(/search query/i);
      expect(searchField).toHaveValue(
        "profile:script:1 AND profile:security:2:pass ",
      );
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });

    it("should handle no features enabled correctly", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => false),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:package:1 ",
          }}
        />,
      );

      const searchField = screen.getByLabelText(/search query/i);
      expect(searchField).toHaveValue("profile:package:1 ");
      expect(
        screen.queryByText(/invalid profile type/i),
      ).not.toBeInTheDocument();
    });

    it("should reject profile:script when script-profiles feature is disabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => false),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:script:1 ",
          }}
        />,
      );

      expect(
        screen.getByText('"profile" has invalid profile type "script".'),
      ).toBeInTheDocument();
    });

    it("should reject profile:wsl when wsl-child-instance-profiles feature is disabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => false),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:wsl:1:compliant ",
          }}
        />,
      );

      expect(
        screen.getByText('"profile" has invalid profile type "wsl".'),
      ).toBeInTheDocument();
    });

    it("should reject invalid security status when usg-profiles feature is disabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn(() => false),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:security:1:pass ",
          }}
        />,
      );

      expect(
        screen.getByText('"profile" has invalid profile type "security".'),
      ).toBeInTheDocument();
    });

    it("should reject invalid wsl status when wsl-child-instance-profiles feature is disabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authContextValues,
        isFeatureEnabled: vi.fn((key) => key === "usg-profiles"),
      });

      renderWithProviders(
        <SavedSearchForm
          {...defaultProps}
          mode="create"
          initialValues={{
            title: "Test",
            search: "profile:wsl:1:compliant ",
          }}
        />,
      );

      expect(
        screen.getByText('"profile" has invalid profile type "wsl".'),
      ).toBeInTheDocument();
    });
  });
});
