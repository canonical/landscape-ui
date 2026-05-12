import { renderWithProviders } from "@/tests/render";
import { afterEach, describe, expect } from "vitest";
import PublishMirrorForm from "./PublishMirrorForm";
import { mirrors } from "@/tests/mocks/mirrors";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { publications } from "@/tests/mocks/publications";

const mockPublicationName = "publications/publication";

const mockCreatePublication = vi.fn(() => ({
  data: {
    name: mockPublicationName,
  },
}));

const mockPublishPublication = vi.fn();

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    useGetMirror: () => ({ data: { data: mirrors[0] } }),
    useListPublicationTargets: () => ({
      data: { data: { publicationTargets } },
    }),
    useListPublications: () => ({
      data: {
        data: {
          publications: publications.filter(
            (p) => p.source === mirrors[0].name,
          ),
        },
      },
    }),
  };
});

vi.mock("@/features/publications", async () => {
  const actual = await vi.importActual("@/features/publications");

  return {
    ...actual,
    useCreatePublication: () => ({
      createPublication: mockCreatePublication,
      isCreatingPublication: false,
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
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Publication name" }),
      "My publication",
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockCreatePublication).toHaveBeenCalledOnce();
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
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

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

    expect(mockCreatePublication).not.toHaveBeenCalled();
  });

  it("passes settings checkboxes to createPublication", async () => {
    renderWithProviders(
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Publication name" }),
      "Settings test publication",
    );

    await user.click(
      screen.getByRole("checkbox", { name: /hash based indexing/i }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /automatic installation/i }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /automatic upgrades/i }),
    );
    await user.click(screen.getByRole("checkbox", { name: /skip bz2/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /skip content indexing/i }),
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockCreatePublication).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            acquireByHash: true,
            notAutomatic: false,
            butAutomaticUpgrades: true,
            skipBz2: true,
            skipContents: true,
          }),
        }),
      );
    });
  });

  it("shows validation error when publication name is empty", async () => {
    renderWithProviders(
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
    expect(mockCreatePublication).not.toHaveBeenCalled();
  });

  it("includes signing key in createPublication payload when provided", async () => {
    renderWithProviders(
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Publication name" }),
      "Signed publication",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Signing GPG key" }),
      "-----BEGIN PGP PRIVATE KEY BLOCK-----",
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockCreatePublication).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            gpgKey: { armor: "-----BEGIN PGP PRIVATE KEY BLOCK-----" },
          }),
        }),
      );
    });
  });

  it("selects a different publication target", async () => {
    const [, target] = publicationTargets;
    assert(target?.name);

    renderWithProviders(
      <PublishMirrorForm />,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Publication name" }),
      "Different target publication",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Publication target" }),
      target.name,
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockCreatePublication).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            publicationTarget: target.name,
          }),
        }),
      );
    });
  });
});
