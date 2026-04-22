import { setEndpointStatus } from "@/tests/controllers/controller";
import { pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { UBUNTU_ARCHIVE_SOURCE_URL } from "../../constants";
import EditPocketForm from "./EditPocketForm";

const mirrorPocket = pockets.find(
  (p) =>
    p.mode === "mirror" && !p.mirror_uri.startsWith(UBUNTU_ARCHIVE_SOURCE_URL),
);
assert(mirrorPocket);
const mirrorPocketProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: mirrorPocket,
};

const uploadPocket = pockets.find((p) => p.mode === "upload");
assert(uploadPocket);
const uploadPocketProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: uploadPocket,
};
const uploadPocketAllowUnsignedProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: {
    ...uploadPocket,
    upload_allow_unsigned: true,
  },
};

const uploadPocketWithKnownGpgKeysProps: ComponentProps<typeof EditPocketForm> =
  {
    distributionName: "Ubuntu",
    seriesName: "Focal Fossa",
    pocket: {
      ...uploadPocket,
      upload_gpg_keys: [
        {
          fingerprint: "",
          id: 26,
          has_secret: false,
          name: "test-public",
        },
      ],
    },
  };

const pullPocketWithFilterType = pockets.find(
  (p) => p.mode === "pull" && p.filter_type,
);
assert(pullPocketWithFilterType);
const pullPocketWithFilterTypeProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pullPocketWithFilterType,
};

const pullPocketWithoutFilterType = pockets.find(
  (p) => p.mode === "pull" && p.filter_type === null,
);
assert(pullPocketWithoutFilterType);
const pullPocketWithoutFilterTypeProps: ComponentProps<typeof EditPocketForm> =
  {
    distributionName: "Ubuntu",
    seriesName: "Focal Fossa",
    pocket: pullPocketWithoutFilterType,
  };

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("checkbox", { name: "Main" }));
  await user.click(screen.getByRole("checkbox", { name: "amd64" }));
};

describe("EditPocketForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders form fields for mirror pocket", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...mirrorPocketProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Mirror URI",
      "Mirror suite",
      "Mirror GPG key",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for upload pocket", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...uploadPocketProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Allow uploaded packages to be unsigned",
      "Uploader GPG keys",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for pull pocket with filter type", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...pullPocketWithFilterTypeProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Filter packages",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for pull pocket without filter type", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...pullPocketWithoutFilterTypeProps} />,
    );
    expect(container).toHaveTexts(["Components", "Architectures", "GPG Key"]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("disables uploader gpg keys when unsigned uploads are allowed", async () => {
    const user = userEvent.setup();

    renderWithProviders(<EditPocketForm {...uploadPocketProps} />);

    await user.click(
      screen.getByRole("checkbox", {
        name: "Allow uploaded packages to be unsigned",
      }),
    );

    expect(
      screen.getByRole("combobox", { name: "Uploader GPG keys" }),
    ).toHaveAttribute("disabled");
  });

  it("normalizes filter package input by removing spaces", async () => {
    const user = userEvent.setup();

    renderWithProviders(<EditPocketForm {...pullPocketWithFilterTypeProps} />);

    const filterInput = screen.getByRole("textbox", {
      name: "Filter packages",
    });

    await user.clear(filterInput);
    await user.type(filterInput, "  foo, bar ,baz ");

    expect(filterInput).toHaveValue("foo,bar,baz");
  });

  it("updates checkbox groups", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...mirrorPocketProps} />);

    await fillRequiredFields(user);

    expect(screen.getByRole("checkbox", { name: "Main" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "amd64" })).toBeChecked();
  });

  it("submits upload pocket changes and supports uploader gpg key selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...uploadPocketProps} />);
    await fillRequiredFields(user);

    await user.click(
      screen.getByRole("combobox", { name: "Uploader GPG keys" }),
    );
    await user.click(screen.getByRole("checkbox", { name: "test-public" }));
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits upload pocket changes when unsigned uploads are enabled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...uploadPocketProps} />);
    await fillRequiredFields(user);

    await user.click(
      screen.getByRole("checkbox", {
        name: "Allow uploaded packages to be unsigned",
      }),
    );
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits upload pocket with original allow-unsigned pocket data", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...uploadPocketAllowUnsignedProps} />);
    await fillRequiredFields(user);

    await user.click(
      screen.getByRole("checkbox", {
        name: "Allow uploaded packages to be unsigned",
      }),
    );
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits upload pocket without uploader gpg key changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditPocketForm {...uploadPocketWithKnownGpgKeysProps} />,
    );
    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits pull pocket changes with updated filter package list", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...pullPocketWithFilterTypeProps} />);
    await fillRequiredFields(user);

    const filterInput = screen.getByRole("textbox", {
      name: "Filter packages",
    });
    await user.clear(filterInput);
    await user.type(filterInput, "alpha,beta");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits pull pocket changes without modifying filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...pullPocketWithFilterTypeProps} />);
    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits pull pocket without filter type", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditPocketForm {...pullPocketWithoutFilterTypeProps} />,
    );
    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("submits mirror pocket changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPocketForm {...mirrorPocketProps} />);
    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("shows notification when edit pocket submit fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "EditPocket" });

    renderWithProviders(<EditPocketForm {...mirrorPocketProps} />);
    await fillRequiredFields(user);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
