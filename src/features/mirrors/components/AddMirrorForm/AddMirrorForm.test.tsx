import { renderWithProviders } from "@/tests/render";
import AddMirrorForm from "./AddMirrorForm";
import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UBUNTU_ARCHIVE_HOST, UBUNTU_SNAPSHOTS_HOST } from "../../constants";
import type { CreateMirrorData } from "@canonical/landscape-openapi";
import { useLocation } from "react-router";
import { mirrors } from "@/tests/mocks/mirrors";

const PULLING_NOTE = /pulling and parsing repository data/i;

const mockCreateMirror = vi.fn(() => ({ data: mirrors[0] }));

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useCreateMirror: () => ({
      mutateAsync: mockCreateMirror,
    }),
  };
});

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

describe("AddMirrorForm", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    mockCreateMirror.mockClear();

    renderWithProviders(
      <>
        <AddMirrorForm />
        <LocationDisplay />
      </>,
    );

    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });
    await user.type(screen.getByLabelText("Name"), "Name");
  });

  it("shows success notification with Update mirror action", async () => {
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    const notification = await screen.findByText(
      /You have successfully added Name/i,
    );
    expect(notification).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Update mirror" }));

    expect(notification).not.toBeInTheDocument();

    const location = screen.getByTestId("location");
    expect(location).toHaveTextContent("sidePath=view");
    expect(location).toHaveTextContent(
      `name=${mirrors[0].name.replace("/", "%2F")}`,
    );
    expect(location).toHaveTextContent("updateModal=true");
  });

  it("submits an ubuntu archive mirror with the default https URL", async () => {
    expect(screen.getByLabelText("Source URL")).toHaveValue(
      `https://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
    );

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: `https://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
      }),
    );
  });

  it("submits an ubuntu archive mirror pointed at a custom CDN", async () => {
    const cdnUrl = "https://eu.archive.ubuntu.com/ubuntu/";

    const sourceUrlField = screen.getByLabelText("Source URL");
    await user.clear(sourceUrlField);
    await user.type(sourceUrlField, cdnUrl);

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: cdnUrl,
      }),
    );
  });

  it("rejects an http source URL with an HTTPS validation error", async () => {
    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    const sourceUrlField = screen.getByLabelText("Source URL");
    await user.type(sourceUrlField, "http://insecure.example.com/");
    await user.tab();

    expect(
      await screen.findByText(/source url must use https/i),
    ).toBeInTheDocument();
  });

  it("submits an ubuntu snapshot mirror", async () => {
    const date = "2026-04-15";

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Ubuntu snapshots",
    );

    fireEvent.change(screen.getByLabelText("Snapshot date"), {
      target: { value: date },
    });

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: `https://${UBUNTU_SNAPSHOTS_HOST}/ubuntu/${date}`,
      }),
    );
  });

  it("submits an ubuntu pro mirror", async () => {
    const token = "ABCDEFG";

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Ubuntu Pro",
    );

    await user.type(screen.getByLabelText("Bearer token"), token);
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        archiveRoot: `https://bearer:${token}@esm.ubuntu.com/infra/ubuntu/`,
      }),
    );
  });

  it("explains which token an ubuntu pro mirror requires", async () => {
    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Ubuntu Pro",
    );

    const tokenInput = screen.getByLabelText("Bearer token");
    expect(tokenInput).toBeInTheDocument();

    // The explanatory copy now lives in a tooltip on the field label.
    const helpIcon = document
      .querySelector(`label[for="${tokenInput.id}"]`)
      ?.querySelector(".p-icon--help");
    assert(helpIcon);
    await user.hover(helpIcon);

    const tooltip = await screen.findByRole("tooltip");
    expect(
      within(tooltip).getByText(
        /this is not your ubuntu pro subscription token/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(tooltip).getByText("/etc/apt/auth.conf.d/90ubuntu-advantage"),
    ).toBeInTheDocument();
  });

  it("submits a mirror with preserve signatures enabled", async () => {
    await user.click(screen.getByLabelText(/Preserve upstream signing key/));
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        preserveSignatures: true,
      }),
    );
  });

  it("clears package filter and include dependencies when preserve signatures is enabled", async () => {
    const packageFilterField = screen.getByLabelText("Filter");
    const includeDepsCheckbox = screen.getByLabelText(
      /Include dependencies in filter/,
    );

    await user.type(packageFilterField, "nginx*");
    await user.click(includeDepsCheckbox);

    expect(packageFilterField).toHaveValue("nginx*");
    expect(includeDepsCheckbox).toBeChecked();

    await user.click(screen.getByLabelText(/Preserve upstream signing key/));

    expect(packageFilterField).toHaveValue("");
    expect(includeDepsCheckbox).not.toBeChecked();
  });

  it("submits a third-party mirror", async () => {
    const params = {
      archiveRoot: "https://archive.ubuntu.com/",
      distribution: "focal",
      components: ["main", "universe"],
      architectures: ["amd64", "arm64"],
      gpgKey: { armor: "ABCDEFG" },
    } satisfies Partial<CreateMirrorData["body"]>;

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    await user.type(screen.getByLabelText("Source URL"), params.archiveRoot);
    await user.type(screen.getByLabelText("Distribution"), params.distribution);
    await user.type(
      screen.getByLabelText("Components"),
      params.components.join(", "),
    );
    await user.type(
      screen.getByLabelText("Architectures"),
      params.architectures.join(", "),
    );
    await user.type(
      screen.getByLabelText("Verification GPG key"),
      params.gpgKey.armor,
    );

    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(mockCreateMirror).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining(params),
    );
  });
});

describe("AddMirrorForm loading state", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockCreateMirror.mockClear();
  });

  it("renders the form immediately with a muted 'pulling' note while archive info is fetched", async () => {
    renderWithProviders(<AddMirrorForm />);

    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });
    expect(screen.queryByText(PULLING_NOTE)).not.toBeInTheDocument();
  });

  it("lets users fill the Name field while archive info is still loading and preserves the value after hydration", async () => {
    renderWithProviders(<AddMirrorForm />);

    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    const nameField = screen.getByLabelText("Name");
    expect(nameField).toBeEnabled();
    expect(screen.getByLabelText("Source type")).toBeEnabled();

    await user.type(nameField, "early-mirror");
    expect(nameField).toHaveValue("early-mirror");
    expect(screen.getByLabelText("Name")).toHaveValue("early-mirror");
  });

  it("disables the Distribution dropdown while archive info is loading and re-enables it once data arrives", async () => {
    renderWithProviders(<AddMirrorForm />);

    const distributionField = screen.getByLabelText("Distribution");
    expect(distributionField).toBeDisabled();

    await waitForElementToBeRemoved(() => screen.queryByText(PULLING_NOTE), {
      timeout: 2000,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Distribution")).not.toBeDisabled();
    });
  });

  it("hides the 'pulling' note when the user picks the third-party source type during loading", async () => {
    renderWithProviders(<AddMirrorForm />);
    expect(screen.getByText(PULLING_NOTE)).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("Source type"),
      "Third party",
    );

    expect(screen.queryByText(PULLING_NOTE)).not.toBeInTheDocument();
  });
});
