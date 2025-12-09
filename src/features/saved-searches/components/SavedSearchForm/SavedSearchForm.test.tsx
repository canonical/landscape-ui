import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SavedSearchForm from "./SavedSearchForm";

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
});
