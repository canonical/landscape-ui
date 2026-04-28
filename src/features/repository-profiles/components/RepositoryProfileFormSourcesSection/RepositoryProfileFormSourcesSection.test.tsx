import { aptSources } from "@/tests/mocks/apt-sources";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileFormSourcesSection from "./RepositoryProfileFormSourcesSection";

const defaultProps = {
  sources: aptSources,
  onRemoveSource: vi.fn(),
  onEditSource: vi.fn(),
};

describe("RepositoryProfileFormSourcesSection", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders column headers", () => {
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} />,
    );

    expect(screen.getByText("Source name")).toBeInTheDocument();
  });

  it("renders empty state message when no sources", () => {
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} sources={[]} />,
    );

    expect(
      screen.getByText("No sources have been added yet."),
    ).toBeInTheDocument();
  });

  it("renders source names and types", () => {
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} />,
    );

    for (const source of aptSources.slice(0, 10)) {
      expect(screen.getByText(source.name)).toBeInTheDocument();
    }
  });

  it("calls onEditSource with the correct APTSource on edit button click", async () => {
    const [firstSource] = aptSources;
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} />,
    );

    await user.click(
      screen.getByRole("button", { name: `Edit ${firstSource.name}` }),
    );

    expect(defaultProps.onEditSource).toHaveBeenCalledOnce();
    expect(defaultProps.onEditSource).toHaveBeenCalledWith(
      expect.objectContaining({ name: firstSource.name }),
    );
  });

  it("calls onRemoveSource with the correct APTSource on remove button click", async () => {
    const [firstSource] = aptSources;
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} />,
    );

    await user.click(
      screen.getByRole("button", { name: `Remove ${firstSource.name}` }),
    );

    expect(defaultProps.onRemoveSource).toHaveBeenCalledOnce();
    expect(defaultProps.onRemoveSource).toHaveBeenCalledWith(
      expect.objectContaining({ name: firstSource.name }),
    );
  });

  it("renders validation error message when error prop is provided", () => {
    renderWithProviders(
      <RepositoryProfileFormSourcesSection
        {...defaultProps}
        error="At least one source is required."
      />,
    );

    expect(
      screen.getByText("At least one source is required."),
    ).toBeInTheDocument();
  });

  it("does not render error message when error prop is absent", () => {
    renderWithProviders(
      <RepositoryProfileFormSourcesSection {...defaultProps} />,
    );

    expect(
      screen.queryByText("At least one source is required."),
    ).not.toBeInTheDocument();
  });
});
