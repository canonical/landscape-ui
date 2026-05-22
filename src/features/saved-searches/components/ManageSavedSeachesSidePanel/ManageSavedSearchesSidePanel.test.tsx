import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ManageSavedSearchesSidePanel from "./ManageSavedSearchesSidePanel";

vi.mock("@/components/filter/SearchQueryEditor", () => {
  return {
    default: ({
      label,
      value,
      onChange,
      onBlur,
      error,
      warning,
    }: {
      label: string;
      value: string | undefined;
      onChange?: (value: string | undefined) => void;
      onBlur?: () => void;
      error?: string | false;
      warning?: string | false;
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
        {warning && <span>{warning}</span>}
      </div>
    ),
  };
});

describe("ManageSavedSearchesSidePanel", () => {
  it("should render add saved search button", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    expect(createButton).toBeInTheDocument();
  });

  it("should render saved searches table", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Search Query")).toBeInTheDocument();
  });

  it("should update URL sidePath when Add saved search is clicked", async () => {
    renderWithProviders(
      <>
        <ManageSavedSearchesSidePanel />
        <LocationDisplay />
      </>
    );

    const createButton = await screen.findByRole("button", {
      name: "Add saved search",
    });
    await userEvent.click(createButton);

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=create-saved-search");
  });

  it("should show pagination controls and support page navigation when many saved searches exist", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const nextButton = await screen.findByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    await userEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeInTheDocument();
  });

  it("should update page size when page size selector is changed", async () => {
    renderWithProviders(<ManageSavedSearchesSidePanel />);

    await screen.findByRole("table");

    const pageSizeSelect = await screen.findByRole("combobox", {
      name: /instances per page/i,
    });
    await userEvent.selectOptions(pageSizeSelect, "50");

    expect(pageSizeSelect).toHaveValue("50");
  });
});

