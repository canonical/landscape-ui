import { API_URL, DEBOUNCE_DELAY } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import server from "@/tests/server";
import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageDropdownSearch from "./PackageDropdownSearch";

const instanceId = 1;
const instancePackages = getInstancePackages(instanceId);

const instancePageUrl = ROUTES.instances.details.single(instanceId);
const instancePath = `${ROUTES.instances.root()}/:instanceId`;

const availablePackages = instancePackages.filter(
  (pkg) => pkg.available_version,
);

const props: ComponentProps<typeof PackageDropdownSearch> = {
  selectedItems: [],
  setSelectedItems: vi.fn(),
};

describe("PackageDropdownSearch", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    renderWithProviders(
      <PackageDropdownSearch {...props} />,
      undefined,
      instancePageUrl,
      instancePath,
    );
  });

  it("renders package dropdown search component", () => {
    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
    expect(screen.getByText(/min 3\. characters/i)).toBeInTheDocument();
  });

  describe("Search functionality", () => {
    it("debounces rapid typing into a single API request", async () => {
      let requestCount = 0;
      server.use(
        http.get(`${API_URL}computers/:id/packages`, ({ request }) => {
          requestCount++;
          const url = new URL(request.url);
          const limit = Number(url.searchParams.get("limit"));
          const offset = Number(url.searchParams.get("offset")) || 0;
          const search = url.searchParams.get("search") || "";
          return HttpResponse.json(
            generatePaginatedResponse({
              data: instancePackages,
              limit,
              offset,
              search,
              searchFields: ["name"],
            }),
          );
        }),
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "testpackage");

      await waitFor(() => {
        expect(requestCount).toBeGreaterThan(0);
      });
      await new Promise((resolve) =>
        setTimeout(resolve, DEBOUNCE_DELAY * 2),
      );
      expect(requestCount).toBe(1);
    });

    it("cancels a pending debounced request when the field is cleared", async () => {
      let requestCount = 0;
      server.use(
        http.get(`${API_URL}computers/:id/packages`, ({ request }) => {
          requestCount++;
          const url = new URL(request.url);
          const limit = Number(url.searchParams.get("limit"));
          const offset = Number(url.searchParams.get("offset")) || 0;
          const search = url.searchParams.get("search") || "";
          return HttpResponse.json(
            generatePaginatedResponse({
              data: instancePackages,
              limit,
              offset,
              search,
              searchFields: ["name"],
            }),
          );
        }),
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "testpackage");

      const clearButton = screen.getByRole("button", {
        name: /clear search field/i,
      });
      await user.click(clearButton);

      // Wait past the debounce window to ensure the cancelled request does not fire.
      await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY * 2));
      expect(requestCount).toBe(0);
    });

    it("shows minimum characters help text when fewer than 3 characters are entered", async () => {
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "ab");

      expect(screen.getByText(/min 3\. characters/i)).toBeInTheDocument();
    });

    it("shows matching packages after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      assert(availablePackages[0]);
      await user.type(searchBox, availablePackages[0].name);

      const matchingPackage = await screen.findByText(
        availablePackages[0].name,
      );
      expect(matchingPackage).toBeInTheDocument();
    });

    it("shows no packages found message when search yields no results", async () => {
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "nonexistentpackage");

      const errorText = await screen.findByText(
        /No packages found by "nonexistentpackage"/i,
      );
      expect(errorText).toBeInTheDocument();
    });
  });

  describe("Package selection", () => {
    it("adds package to selected items when clicked", async () => {
      assert(availablePackages[0]);
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, availablePackages[0].name);

      const packageItem = await screen.findByText(availablePackages[0].name);
      await user.click(packageItem);

      expect(props.setSelectedItems).toHaveBeenCalled();
    });

    it("clears search box after selecting a package", async () => {
      assert(availablePackages[0]);
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, availablePackages[0].name);

      const packageItem = await screen.findByText(availablePackages[0].name);
      await user.click(packageItem);

      expect(searchBox).toHaveValue("");
    });
  });

  describe("Clear search functionality", () => {
    it("clears search input when clear button is clicked", async () => {
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "test");
      expect(searchBox).toHaveValue("test");

      const clearButton = screen.getByRole("button", {
        name: /clear search field/i,
      });
      await user.click(clearButton);

      expect(searchBox).toHaveValue("");
    });
  });

  describe("Selected packages display", () => {
    it("displays selected packages in the result list", () => {
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      renderWithProviders(
        <PackageDropdownSearch {...props} selectedItems={[selectedPackage]} />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      expect(screen.getByText(selectedPackage.name)).toBeInTheDocument();
      expect(
        screen.getByText(selectedPackage.available_version ?? ""),
      ).toBeInTheDocument();
    });

    it("removes package when delete button is clicked", async () => {
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      renderWithProviders(
        <PackageDropdownSearch {...props} selectedItems={[selectedPackage]} />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      assert(deleteButton);
      await user.click(deleteButton);

      expect(props.setSelectedItems).toHaveBeenCalled();
    });
  });
});
