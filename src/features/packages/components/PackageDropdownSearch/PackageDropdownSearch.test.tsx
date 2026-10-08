import { API_URL, DEBOUNCE_DELAY } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import server from "@/tests/server";
import { packages as availablePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageDropdownSearch from "./PackageDropdownSearch";
import type { SearchPackagesRequest, SearchPackagesResponse } from "../../api";
import { DEB_MANAGEMENT_PACKAGE_LIMIT } from "../../constants";

const instanceId = 1;
const instancePageUrl = ROUTES.instances.details.single(instanceId);
const instancePath = `${ROUTES.instances.root()}/:instanceId`;

const props: ComponentProps<typeof PackageDropdownSearch> = {
  selectedItems: [],
  setSelectedItems: vi.fn(),
  actionType: "install",
  instanceIds: [instanceId],
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
  });

  describe("Search functionality", () => {
    it("debounces rapid typing into a single API request", async () => {
      let requestCount = 0;
      server.use(
        http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
          `${API_URL}packages\\:search`,
          async ({ request }) => {
            requestCount++;

            const body = await request.json();

            const response = generatePaginatedResponse({
              data: availablePackages.filter((pkg) => {
                if (body.names === undefined) {
                  return true;
                }

                return body.names.includes(pkg.name);
              }),
              limit: body.limit,
              offset: body.offset,
              search: body.text,
              searchFields: ["name", "summary"],
            });

            return HttpResponse.json({
              packages: response.results,
              count: response.count,
              next: response.next,
              prev: response.previous,
            });
          },
        ),
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "testpackage");

      await waitFor(() => {
        expect(requestCount).toBeGreaterThan(0);
      });
      await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY * 2));
      expect(requestCount).toBe(1);
    });

    it("cancels a pending debounced request when the field is cleared", async () => {
      let requestCount = 0;
      server.use(
        http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
          `${API_URL}packages\\:search`,
          async ({ request }) => {
            requestCount++;

            const body = await request.json();

            const response = generatePaginatedResponse({
              data: availablePackages.filter((pkg) => {
                if (body.names === undefined) {
                  return true;
                }

                return body.names.includes(pkg.name);
              }),
              limit: body.limit,
              offset: body.offset,
              search: body.text,
              searchFields: ["name", "summary"],
            });

            return HttpResponse.json({
              packages: response.results,
              count: response.count,
              next: response.next,
              prev: response.previous,
            });
          },
        ),
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

    it("shows matching packages after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      assert(availablePackages[0]);
      await user.type(searchBox, availablePackages[0].name);

      const matchingPackage = await screen.findByText(
        availablePackages[0].name,
      );
      expect(matchingPackage).toBeInTheDocument();
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
    it("removes package when delete button is clicked", async () => {
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          selectedItems={[[selectedPackage, []]]}
        />,
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

  describe("Change version selection limit", () => {
    it("counts selected versions toward the package limit", () => {
      cleanup();
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      const selectedItems: ComponentProps<
        typeof PackageDropdownSearch
      >["selectedItems"] = [
        [
          selectedPackage,
          Array.from({ length: DEB_MANAGEMENT_PACKAGE_LIMIT }, (_, id) => id),
        ],
      ];

      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          actionType="change_version"
          selectedItems={selectedItems}
        />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      expect(screen.getByRole("searchbox")).toBeDisabled();
      expect(
        screen.getByText(
          `You can change version on a maximum of ${DEB_MANAGEMENT_PACKAGE_LIMIT} packages in one single operation.`,
        ),
      ).toBeInTheDocument();
    });

    it("keeps package version selection enabled below the limit", () => {
      cleanup();
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      const selectedItems: ComponentProps<
        typeof PackageDropdownSearch
      >["selectedItems"] = [
        [
          selectedPackage,
          Array.from(
            { length: DEB_MANAGEMENT_PACKAGE_LIMIT - 1 },
            (_, id) => id,
          ),
        ],
      ];

      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          actionType="change_version"
          selectedItems={selectedItems}
        />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      expect(screen.getByRole("searchbox")).toBeEnabled();
      expect(
        screen.queryByText(/maximum of \d+ packages in one single operation/i),
      ).not.toBeInTheDocument();
    });
  });
});
