import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach } from "vitest";
import useAuth from "@/hooks/useAuth";
import OrganisationSwitch from "./OrganisationSwitch";
import userEvent from "@testing-library/user-event";
import useSidePanel from "@/hooks/useSidePanel";
import { AuthContextProps } from "@/context/auth";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useSidePanel");

const singleAccountValues: Pick<AuthContextProps, "account"> = {
  account: {
    current: "account1",
    options: [{ label: "Account 1", value: "account1" }],
    switch: vi.fn().mockImplementation((_, account: string) => {
      if (account === "error") {
        throw new Error(errorMessage);
      }
    }),
  },
};

const multipleAccountValues: Pick<AuthContextProps, "account"> = {
  account: {
    ...singleAccountValues.account,
    options: [
      {
        label: "Account 1",
        value: "account1",
      },
      {
        label: "Account 2",
        value: "account2",
      },
      {
        label: "Error option",
        value: "error",
      },
    ],
  },
};

const closeSidePanel = vi.fn();
const errorMessage = "Error: switching account failed";

describe("OrganisationSwitch", () => {
  it("should render an info item with current organisation if there is no other", () => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue(singleAccountValues);
    vi.mocked(useSidePanel, { partial: true }).mockReturnValue({
      closeSidePanel,
    });

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.queryByText(/organisation/i)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  describe("with multiple organisations", () => {
    beforeEach(() => {
      vi.mocked(useAuth, { partial: true }).mockReturnValue(
        multipleAccountValues,
      );
      vi.mocked(useSidePanel, { partial: true }).mockReturnValue({
        closeSidePanel,
      });

      renderWithProviders(<OrganisationSwitch />);
    });

    it("should render a select if there are multiple organisations", () => {
      expect(
        screen.getByRole("combobox", { name: /organisation/i }),
      ).toBeInTheDocument();
    });

    it("should set the initial organisation correctly", () => {
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("account1");
    });

    it("should change the organisation and close side panel", async () => {
      await userEvent.selectOptions(screen.getByRole("combobox"), "account2");

      expect(multipleAccountValues.account.switch).toHaveBeenCalledWith(
        "account2-token",
        "account2",
      );
      expect(closeSidePanel).toHaveBeenCalled();
    });

    it("should handle errors when changing the organisation", async () => {
      await userEvent.selectOptions(screen.getByRole("combobox"), "error");

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
