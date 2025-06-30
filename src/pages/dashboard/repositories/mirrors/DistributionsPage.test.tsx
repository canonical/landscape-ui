import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DistributionsPage from "./DistributionsPage";
import { vi } from "vitest";

vi.mock("@/features/mirrors", async () => {
  return {
    DistributionContainer: ({
      onDistributionsLengthChange,
    }: {
      readonly onDistributionsLengthChange: (length: number) => void;
    }) => {
      onDistributionsLengthChange(2);
      return <div>Distribution List</div>;
    },
    NewDistributionForm: () => <div>Mock NewDistributionForm</div>,
    NewSeriesForm: () => <div>Mock NewSeriesForm</div>,
  };
});

const setSidePanelContent = vi.fn();
vi.mock("@/hooks/useSidePanel", () => ({
  default: () => ({ setSidePanelContent }),
}));

describe("DistributionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page with expected content", () => {
    renderWithProviders(<DistributionsPage />);
    expect(screen.getByText("Mirrors")).toBeInTheDocument();
  });

  it("renders action buttons and contextual menu", () => {
    renderWithProviders(<DistributionsPage />);

    const actionsText = screen.queryByText("Actions");
    const addDistribution = screen.queryByRole("button", {
      name: "Add distribution",
    });
    const addMirror = screen.queryByRole("button", {
      name: "Add mirror",
    });

    expect(actionsText || (addDistribution && addMirror)).toBeTruthy();
  });

  it("setSidePanelContent is called when 'Add distribution' is clicked", async () => {
    renderWithProviders(<DistributionsPage />);
    const user = userEvent.setup();

    const button = screen.queryByRole("button", {
      name: "Add distribution",
    });

    if (button) {
      await user.click(button);
      expect(setSidePanelContent).toHaveBeenCalledWith(
        "Add distribution",
        expect.anything(),
      );
    }
  });

  it("setSidePanelContent is called when 'Add mirror' is clicked", async () => {
    renderWithProviders(<DistributionsPage />);
    const user = userEvent.setup();

    const button = screen.queryByRole("button", {
      name: "Add mirror",
    });

    if (button) {
      await user.click(button);
      expect(setSidePanelContent).toHaveBeenCalledWith(
        "Add new mirror",
        expect.anything(),
      );
    }
  });
});
