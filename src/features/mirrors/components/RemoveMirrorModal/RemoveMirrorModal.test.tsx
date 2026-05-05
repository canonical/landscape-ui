import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import RemoveMirrorModal from "./RemoveMirrorModal";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { publications } from "@/tests/mocks/publications";
import type { Publication } from "@canonical/landscape-openapi";

const mockDeleteMirror = vi.fn();

const useGetPublicationsBySource = vi.hoisted(() =>
  vi.fn(() => ({
    publications: publications as Publication[],
    isGettingPublications: false,
  })),
);

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useDeleteMirror: () => ({
      mutateAsync: mockDeleteMirror,
    }),
  };
});

vi.mock("@/features/publications", async () => {
  const actual = await vi.importActual("@/features/publications");

  return {
    ...actual,
    useGetPublicationsBySource,
  };
});

describe("RemoveMirrorModal", () => {
  const props: ComponentProps<typeof RemoveMirrorModal> = {
    close: () => undefined,
    isOpen: true,
    mirrorDisplayName: "Mirror display name",
    mirrorName: "mirrors/name",
  };

  const user = userEvent.setup();

  it("doesn't render while closed", async () => {
    renderWithProviders(<RemoveMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(`Remove ${props.mirrorDisplayName}`),
    ).not.toBeInTheDocument();
  });

  it("renders a list of publications", async () => {
    renderWithProviders(<RemoveMirrorModal {...props} />);

    for (const { displayName } of publications) {
      expect(screen.getByText(displayName)).toBeInTheDocument();
    }
  });

  it("renders a message when there are no publications", async () => {
    useGetPublicationsBySource.mockReturnValueOnce({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(<RemoveMirrorModal {...props} />);

    expect(
      screen.queryByText(
        "This mirror is associated with the following publications:",
      ),
    ).not.toBeInTheDocument();
  });

  it("removes a mirror", async () => {
    renderWithProviders(<RemoveMirrorModal {...props} />);

    await user.type(
      screen.getByPlaceholderText(`remove ${props.mirrorDisplayName}`),
      `remove ${props.mirrorDisplayName}`,
    );
    await user.click(screen.getByRole("button", { name: /remove mirror/i }));

    expect(mockDeleteMirror).toHaveBeenCalledTimes(1);
  });
});
