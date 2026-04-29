import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, vi } from "vitest";
import { PATHS, ROUTES } from "@/libs/routes";
import EmployeeDropdown from "./EmployeeDropdown";
import { employees as mockEmployees } from "@/tests/mocks/employees";

const baseProps: ComponentProps<typeof EmployeeDropdown> = {
  employee: null,
  setEmployee: vi.fn(),
  error: undefined,
};

describe("EmployeeDropdown", () => {
  describe("component", () => {
    beforeEach(() => {
      setEndpointStatus("default");
    });

    const renderDropdown = (
      overrideProps?: Partial<ComponentProps<typeof EmployeeDropdown>>,
    ) => {
      return renderWithProviders(
        <EmployeeDropdown {...baseProps} {...overrideProps} />,
        undefined,
        ROUTES.instances.details.single(1),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );
    };

    it("renders employee dropdown search component", () => {
      renderDropdown();
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("shows matching employees after searching", async () => {
      renderDropdown();

      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "John");
      expect(searchBox).toHaveValue("John");

      const employees = await screen.findAllByText("John");
      const matchingEmployees = mockEmployees.filter((employee) =>
        employee.name.includes("John"),
      );
      expect(employees).toHaveLength(matchingEmployees.length);
    });

    it("shows error if no matching employees found", async () => {
      renderDropdown();

      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "checking for error");
      expect(searchBox).toHaveValue("checking for error");

      expect(await screen.findByText(/No employees found by/i)).toBeVisible();
    });

    it("allows removing selected employee", async () => {
      const setEmployee = vi.fn();
      renderDropdown({ employee: mockEmployees[0], setEmployee });

      await userEvent.click(screen.getByRole("button", { name: /remove/i }));

      expect(setEmployee).toHaveBeenCalledWith(null);
    });

    it("keeps dropdown open and resets search when clear button is used", async () => {
      const user = userEvent.setup();
      renderDropdown();

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "John");
      await user.click(
        screen.getByRole("button", { name: /clear search field/i }),
      );

      expect(searchBox).toHaveValue("");
      expect(
        await screen.findByText(mockEmployees[0]?.name ?? "John Doe"),
      ).toBeInTheDocument();
    });

    it("handles selecting an employee from the list", async () => {
      const user = userEvent.setup();
      const setEmployee = vi.fn();
      renderDropdown({ setEmployee });

      await user.type(screen.getByRole("searchbox"), "John");
      const [firstEmployeeOption] =
        await screen.findAllByTestId("dropdownElement");
      assert(firstEmployeeOption);
      await user.click(firstEmployeeOption);

      expect(setEmployee).toHaveBeenCalledWith(mockEmployees[0]);
      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("loads more results when suggestion list is scrolled near bottom", async () => {
      const user = userEvent.setup();
      renderDropdown();

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "a");

      const list = await screen.findByRole("listbox");
      Object.defineProperty(list, "scrollHeight", {
        configurable: true,
        value: 120,
      });
      Object.defineProperty(list, "clientHeight", {
        configurable: true,
        value: 80,
      });
      Object.defineProperty(list, "scrollTop", {
        configurable: true,
        value: 30,
      });

      list.dispatchEvent(new Event("scroll"));

      await waitFor(async () => {
        expect((await screen.findAllByTestId("dropdownElement")).length).toBe(
          2,
        );
      });
    });

    it("shows next-page loading indicator while fetching additional results", async () => {
      const user = userEvent.setup();
      setEndpointStatus({ status: "loading", path: "employees" });
      renderDropdown();

      await user.type(screen.getByRole("searchbox"), "a");
      const list = await screen.findByRole("listbox");

      Object.defineProperty(list, "scrollHeight", {
        configurable: true,
        value: 100,
      });
      Object.defineProperty(list, "clientHeight", {
        configurable: true,
        value: 80,
      });
      Object.defineProperty(list, "scrollTop", {
        configurable: true,
        value: 30,
      });

      list.dispatchEvent(new Event("scroll"));

      expect(await screen.findByText("Loading...")).toBeInTheDocument();
    });

    it("does not fetch next page when there is no next page", async () => {
      const user = userEvent.setup();
      renderDropdown();

      await user.type(screen.getByRole("searchbox"), "a");
      const list = await screen.findByRole("listbox");
      const initialSuggestionCount = (
        await screen.findAllByTestId("dropdownElement")
      ).length;

      Object.defineProperty(list, "scrollHeight", {
        configurable: true,
        value: 100,
      });
      Object.defineProperty(list, "clientHeight", {
        configurable: true,
        value: 80,
      });
      Object.defineProperty(list, "scrollTop", {
        configurable: true,
        value: 0,
      });

      list.dispatchEvent(new Event("scroll"));

      await waitFor(async () => {
        expect((await screen.findAllByTestId("dropdownElement")).length).toBe(
          initialSuggestionCount,
        );
      });
    });

    it("renders field-level error text", () => {
      renderDropdown({ error: "Employee is required" });
      expect(screen.getByText("Employee is required")).toBeInTheDocument();
    });
  });
});
