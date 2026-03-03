import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import UpgradeConfirmationModal from "./UpgradeConfirmationModal";

const props = {
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  eligibleCount: 2,
  isCreating: false,
} satisfies ComponentProps<typeof UpgradeConfirmationModal>;

describe("UpgradeConfirmationModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      eligibleCount: 1,
      expectedTitle: "Upgrade distribution for 1 instance",
      warningText:
        /risk that the instance will not be able to contact landscape/i,
    },
    {
      eligibleCount: 2,
      expectedTitle: "Upgrade distributions for 2 instances",
      warningText:
        /risk that the instances will not be able to contact landscape/i,
    },
  ])(
    "renders title and warning text for $eligibleCount eligible instance(s)",
    ({ eligibleCount, expectedTitle, warningText }) => {
      renderWithProviders(
        <UpgradeConfirmationModal {...props} eligibleCount={eligibleCount} />,
      );

      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      expect(screen.getByText(warningText)).toBeInTheDocument();
    },
  );

  it("calls onConfirm when confirm is clicked", async () => {
    renderWithProviders(<UpgradeConfirmationModal {...props} />);

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel is clicked", async () => {
    renderWithProviders(<UpgradeConfirmationModal {...props} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button while creating upgrades", () => {
    renderWithProviders(<UpgradeConfirmationModal {...props} isCreating />);

    expect(screen.getByRole("button", { name: /confirm/i })).toHaveClass(
      "is-disabled",
    );
  });
});
