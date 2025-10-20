import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AttachTokenForm from "./AttachTokenForm";
import { instances } from "@/tests/mocks/instance";
import { UBUNTU_PRO_DASHBOARD_URL } from "../TokenFormBase";

describe("AttachTokenForm", () => {
  it("renders with instances without tokens", () => {
    const selectedInstances = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          !instance.ubuntu_pro_info.attached,
      )
      .slice(0, 2);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText(/attaching a token to/i)).not.toBeInTheDocument();
  });

  it("renders with instances that have tokens", () => {
    const selectedInstances = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          instance.ubuntu_pro_info.attached,
      )
      .slice(0, 2);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText(/attaching a token to/i)).not.toBeInTheDocument();
  });

  it("renders mixed token warning when some instances have tokens", () => {
    const [withToken] = instances.filter(
      (instance) =>
        instance.ubuntu_pro_info?.result === "success" &&
        instance.ubuntu_pro_info.attached,
    );
    const withoutTokens = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          !instance.ubuntu_pro_info.attached,
      )
      .slice(0, 2);

    const selectedInstances = [withToken, ...withoutTokens];
    const totalCount = selectedInstances.length;

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(
      screen.getByText(
        new RegExp(`attaching a token to ${totalCount} instances`, "i"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will be attached to this token/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/will override/i)).toBeInTheDocument();
  });

  it("renders for a single instance without token", () => {
    const selectedInstances = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          !instance.ubuntu_pro_info.attached,
      )
      .slice(0, 1);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText(/attaching a token to/i)).not.toBeInTheDocument();
  });

  it("renders for a single instance with token", () => {
    const selectedInstances = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          instance.ubuntu_pro_info.attached,
      )
      .slice(0, 1);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText(/attaching a token to/i)).not.toBeInTheDocument();
  });

  it("handles instances without ubuntu_pro_info", () => {
    const selectedInstances = instances
      .filter((instance) => !instance.ubuntu_pro_info)
      .slice(0, 2);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /attach token/i }),
    ).toBeInTheDocument();
  });

  it("includes Ubuntu Pro dashboard link", () => {
    const selectedInstances = instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          !instance.ubuntu_pro_info.attached,
      )
      .slice(0, 1);

    renderWithProviders(
      <AttachTokenForm selectedInstances={selectedInstances} />,
    );

    const link = screen.getByRole("link", { name: /ubuntu pro dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", UBUNTU_PRO_DASHBOARD_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });
});
