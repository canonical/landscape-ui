import { describe } from "vitest";
import PageNumberInput from "./PageNumberInput";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("PageNumberInput", () => {
  describe("onKeyDown", () => {
    it("Enter: should use the enter key to change the page", async () => {
      const setCurrentPage = vi.fn();

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

      await userEvent.keyboard("2{Enter}");

      expect(setCurrentPage).toHaveBeenLastCalledWith(2);
    });
  });

  describe("onBlur", () => {
    it("should change the page on blur", async () => {
      const setCurrentPage = vi.fn();

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

      await userEvent.keyboard("2");
      await userEvent.tab();

      expect(setCurrentPage).toHaveBeenLastCalledWith(2);
    });

    it("should not change the page on blur when there is an error", async () => {
      const setCurrentPage = vi.fn();

      render(
        <PageNumberInput
          currentPage={1}
          max={2}
          min={1}
          setCurrentPage={setCurrentPage}
        />,
      );

      const input = screen.getByRole<HTMLInputElement>("spinbutton", {
        name: "page number",
      });

      await userEvent.tripleClick(input);
      await userEvent.keyboard("{Backspace}");

      const error = screen.getByText("Enter a page number.");

      expect(error).toBeInTheDocument();

      await userEvent.tab();

      expect(setCurrentPage).not.toHaveBeenCalled();
      expect(input.valueAsNumber).toBe(1);
      expect(error).not.toBeInTheDocument();
    });
  });

  describe("onChange", () => {
    it("should show an error when the page number is out of range", async () => {
      const setCurrentPage = vi.fn();

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

      await userEvent.keyboard("0");

      const error = screen.getByText('"0" is not a valid page number.');

      expect(error).toBeInTheDocument();

      await userEvent.keyboard("{Backspace}1");

      expect(error).not.toBeInTheDocument();
    });
  });
});
