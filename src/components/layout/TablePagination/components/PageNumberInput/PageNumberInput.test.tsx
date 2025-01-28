import { beforeEach, describe } from "vitest";
import PageNumberInput from "./PageNumberInput";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("PageNumberInput", () => {
  const setCurrentPage = vi.fn();

  beforeEach(async () => {
    setCurrentPage.mockClear();

    render(
      <PageNumberInput
        currentPage={1}
        max={2}
        min={1}
        setCurrentPage={setCurrentPage}
      />,
    );

    await userEvent.tripleClick(
      screen.getByRole("spinbutton", { name: "page number" }),
    );
  });

  it("should use the enter key to change the page", async () => {
    await userEvent.keyboard("2{Enter}");

    expect(setCurrentPage).toHaveBeenLastCalledWith(2);
  });

  describe("onBlur", () => {
    it("should change the page on blur", async () => {
      await userEvent.keyboard("2");
      await userEvent.tab();

      expect(setCurrentPage).toHaveBeenLastCalledWith(2);
    });

    it("should not change the page on blur when there is an error", async () => {
      await userEvent.keyboard("{Backspace}");

      const error = screen.getByText("Enter a page number.");

      expect(error).toBeInTheDocument();

      await userEvent.tab();

      expect(setCurrentPage).not.toHaveBeenCalled();
      expect(
        screen.getByRole<HTMLInputElement>("spinbutton", {
          name: "page number",
        }).valueAsNumber,
      ).toBe(1);
      expect(error).not.toBeInTheDocument();
    });
  });

  describe("onChange", () => {
    it("should show an error when the page number is out of range", async () => {
      await userEvent.keyboard("0");

      const error = screen.getByText('"0" is not a valid page number.');

      expect(error).toBeInTheDocument();

      await userEvent.keyboard("{Backspace}1");

      expect(error).not.toBeInTheDocument();
    });

    it("should show an error when the page number is not an integer", async () => {
      await userEvent.keyboard("1.1");

      const error = screen.getByText('"1.1" is not a valid page number.');

      expect(error).toBeInTheDocument();

      await userEvent.keyboard("{Backspace}{Backspace}");

      expect(error).not.toBeInTheDocument();
    });
  });
});
