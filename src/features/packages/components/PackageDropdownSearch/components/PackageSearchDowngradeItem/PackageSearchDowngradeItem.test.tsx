import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PackageSearchDowngradeItem from "./PackageSearchDowngradeItem";
import { ICONS } from "@canonical/react-components";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { API_URL } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import type { Package } from "@/features/packages";

const multiSelectFieldProps = vi.hoisted(() => vi.fn());

vi.mock("@/components/form/MultiSelectField", () => ({
  default: (props: {
    readonly disabledItems?: { readonly value: number }[];
    readonly items: { readonly label: string; readonly value: number }[];
    readonly selectedItems?: { readonly value: number }[];
  }) => {
    multiSelectFieldProps(props);
    return null;
  },
}));

const props = {
  selectedPackage: [
    {
      name: "libthai0",
      id: 15,
      version: "0.1.28-1",
      computers: {
        count: 4,
      },
      summary: "Thai language support library",
    },
    [],
  ],
  onDelete: vi.fn(),
  onItemsUpdate: vi.fn(),
  instanceIds: [1, 2, 3, 4],
  isOverLimit: false,
} as const satisfies ComponentProps<typeof PackageSearchDowngradeItem>;

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("PackageSearchDowngradeItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    expect(
      screen.getByRole("button", {
        name: `Delete ${props.selectedPackage[0].name}`,
      }),
    ).toHaveIcon(ICONS.delete);
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${props.selectedPackage[0].name}`,
    });
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });

  it("disables unselected versions when the selection limit is reached", async () => {
    const firstVersion: Package = {
      ...props.selectedPackage[0],
      id: 15,
    };
    const secondVersion: Package = {
      ...props.selectedPackage[0],
      id: 16,
      version: "0.1.29-1",
    };

    server.use(
      http.post(`${API_URL}packages\\:search`, () =>
        HttpResponse.json({
          packages: [firstVersion, secondVersion],
          count: 2,
          prev: null,
          next: null,
        }),
      ),
    );

    renderWithProviders(
      <PackageSearchDowngradeItem
        {...props}
        selectedPackage={[firstVersion, [firstVersion.id]]}
        isOverLimit
      />,
    );

    await screen.findByRole("button", {
      name: `Delete ${firstVersion.name}`,
    });

    await waitFor(() => {
      expect(multiSelectFieldProps).toHaveBeenLastCalledWith(
        expect.objectContaining({
          disabledItems: [
            {
              label: `${secondVersion.version} (4 instances)`,
              value: secondVersion.id,
            },
          ],
          selectedItems: [
            {
              label: `${firstVersion.version} (4 instances)`,
              value: firstVersion.id,
            },
          ],
        }),
      );
    });
  });
});
