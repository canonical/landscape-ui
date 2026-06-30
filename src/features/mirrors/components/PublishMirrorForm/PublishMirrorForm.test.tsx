import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, expect, assert } from "vitest";
import PublishMirrorForm from "./PublishMirrorForm";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { publications } from "@/tests/mocks/publications";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { Suspense } from "react";

const TestComponent = () => {
  const { lastSidePathSegment } = usePageParams();

  if (lastSidePathSegment === "publish") {
    return <PublishMirrorForm />;
  }
};

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
    useGetMirror: (name: string) => ({
      data: { data: mirrors.find((m) => m.name === name) ?? mirrors[0] },
    }),
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

const preserveSignaturesMirror = mirrors.find(
  ({ preserveSignatures }) => preserveSignatures,
);

describe("PublishMirrorForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes to a new publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=publish&name=${mirrors[0].name}`,
    );

    await user.type(
      await screen.findByRole("textbox", { name: "Publication name" }),
      "My publication",
    );
    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText(
        `You have marked ${mirrors[0].displayName} to be published`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A publication has been created and an activity has been queued to publish it to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("locks signing key field if source preserves signatures", async () => {
    assert(preserveSignaturesMirror);

    renderWithProviders(
      <PublishMirrorForm />,
      undefined,
      `?name=${preserveSignaturesMirror.name}`,
    );

    expect(
      screen.queryByRole("textbox", { name: "Signing GPG key" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Signing GPG key")).toBeInTheDocument();
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();

    await user.hover(screen.getByText(NO_DATA_TEXT));

    expect(
      await screen.findByRole("tooltip", {
        name: "This mirror is preserving the upstream signing key",
      }),
    ).toBeInTheDocument();
  });

  it("publishes to an existing publication", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <TestComponent />
      </Suspense>,
      undefined,
      `?sidePath=publish&name=${mirrors[0].name}`,
    );

    await user.click(
      await screen.findByRole("radio", { name: "Existing publication" }),
    );
    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    expect(
      await screen.findByText(
        `You have marked ${mirrors[0].displayName} to be published`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "An activity has been queued to publish the selected publication to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("passes settings to createPublication", async () => {
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
      screen.getByRole("button", { name: /installs and upgrades/i }),
    );
    await user.click(
      await screen.findByRole("option", { name: /automatic upgrades only/i }),
    );
    await user.click(screen.getByRole("checkbox", { name: /skip bz2/i }));
    await user.click(
      screen.getByRole("checkbox", {
        name: /skip generating content indexes/i,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Publish mirror" }));

    await waitFor(() => {
      expect(mockCreatePublication).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            acquireByHash: true,
            notAutomatic: true,
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
      await screen.findByText("This field is required"),
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
