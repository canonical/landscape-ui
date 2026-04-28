import { renderWithProviders } from "@/tests/render";
import { afterEach, describe, expect } from "vitest";
import PublishMirrorForm from "./PublishMirrorForm";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { publications } from "@/tests/mocks/publications";

const mockPublicationName = "publications/publication";

const mockAddPublication = vi.fn(() => ({
  data: {
    name: mockPublicationName,
  },
}));

const mockPublishPublication = vi.fn();

vi.mock("@/features/publications", async () => {
  const actual = await vi.importActual("@/features/publications");

  return {
    ...actual,
    useAddPublication: () => ({
      addPublication: mockAddPublication,
      isAddingPublication: false,
    }),
    usePublishPublication: () => ({
      publishPublication: mockPublishPublication,
      isPublishingPublication: false,
    }),
  };
});

describe("PublishMirrorForm", () => {
  const user = userEvent.setup();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("publishes to a new publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <PublishMirrorForm />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await expectLoadingState();

    await user.type(
      screen.getByRole("textbox", { name: "Publication name" }),
      "My publication",
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockAddPublication).toHaveBeenCalledOnce();
    });

    await waitFor(() => {
      expect(mockPublishPublication).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          publicationName: mockPublicationName,
        }),
      );
    });
  });

  it("publishes to an existing publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <PublishMirrorForm />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await expectLoadingState();

    await user.click(
      screen.getByRole("radio", { name: "Existing publication" }),
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication" }),
      publications[0].name,
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockPublishPublication).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          publicationName: publications[0].name,
        }),
      );
    });

    expect(mockAddPublication).not.toHaveBeenCalled();
  });
});
