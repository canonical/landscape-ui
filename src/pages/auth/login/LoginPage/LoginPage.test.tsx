import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { LoginMethods } from "@/features/auth";

const mockTestParams = (loginMethods: LoginMethods) => {
  vi.doMock("@/features/auth", async () => ({
    ...(await vi.importActual("@/features/auth")),
    useAuthHandle: () => ({
      getLoginMethodsQuery: () => ({
        data: { data: loginMethods },
        isLoading: false,
      }),
    }),
  }));
};

const testResponses: LoginMethods[] = [
  {
    oidc: {
      available: false,
      configurations: [],
    },
    password: {
      available: false,
      enabled: true,
    },
    standalone_oidc: {
      available: false,
      enabled: true,
    },
    ubuntu_one: {
      available: false,
      enabled: true,
    },
  },
  {
    oidc: {
      available: true,
      configurations: [
        {
          id: 1,
          provider: "okta",
          enabled: true,
          name: "Okta",
        },
      ],
    },
    password: {
      available: false,
      enabled: true,
    },
    standalone_oidc: {
      available: false,
      enabled: true,
    },
    ubuntu_one: {
      available: false,
      enabled: true,
    },
  },
  {
    oidc: {
      available: false,
      configurations: [],
    },
    password: {
      available: false,
      enabled: true,
    },
    standalone_oidc: {
      available: true,
      enabled: true,
    },
    ubuntu_one: {
      available: false,
      enabled: true,
    },
  },
  {
    oidc: {
      available: false,
      configurations: [],
    },
    password: {
      available: false,
      enabled: true,
    },
    standalone_oidc: {
      available: false,
      enabled: true,
    },
    ubuntu_one: {
      available: true,
      enabled: true,
    },
  },
  {
    oidc: {
      available: false,
      configurations: [],
    },
    password: {
      available: true,
      enabled: true,
    },
    standalone_oidc: {
      available: false,
      enabled: true,
    },
    ubuntu_one: {
      available: false,
      enabled: true,
    },
  },
  {
    oidc: {
      available: true,
      configurations: [
        {
          id: 1,
          provider: "okta",
          enabled: true,
          name: "Okta",
        },
      ],
    },
    password: {
      available: true,
      enabled: true,
    },
    standalone_oidc: {
      available: true,
      enabled: true,
    },
    ubuntu_one: {
      available: true,
      enabled: true,
    },
  },
];

describe("LoginPage", () => {
  beforeEach(async ({ task: { id } }) => {
    vi.doUnmock("@/features/auth");
    vi.resetModules();

    const taskId = Number(id.substring(id.length - 1));

    mockTestParams(testResponses[taskId]);

    const { default: Component } = await import("./LoginPage");

    renderWithProviders(<Component />);

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();
  });

  it("should render no sign in methods", async () => {
    expect(screen.queryAllByRole("button").length).toBe(0);

    expect(
      screen.getByText(
        "It seems like you have no way to get in. Please contact our support team.",
      ),
    ).toBeInTheDocument();
  });

  it("should render okta sign in method", async () => {
    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent("Sign in with Okta");
  });

  it("should render enterprise sign in method", async () => {
    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Sign in with Enterprise Login",
    );
  });

  it("should render ubuntu one sign in method", async () => {
    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Sign in with Ubuntu One",
    );
  });

  it("should render email and password sign in method", async () => {
    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBe(2);

    expect(buttons[0]).toHaveTextContent("Show");
    expect(buttons[1]).toHaveTextContent("Sign in");

    expect(
      screen.getByRole("textbox", { name: /identity/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember this device/i)).toBeInTheDocument();
  });

  it("should render all sign in method", async () => {
    expect(
      screen.getByRole("textbox", { name: /identity/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember this device/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign in with Okta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Ubuntu One" }),
    ).toBeInTheDocument();
  });
});
