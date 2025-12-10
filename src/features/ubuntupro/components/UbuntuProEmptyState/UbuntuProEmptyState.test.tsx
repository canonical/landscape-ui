import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import UbuntuProEmptyState from "./UbuntuProEmptyState";

describe("UbuntuProEmptyState", () => {
  const [instanceWithoutToken] = instances.filter(
    (instance) =>
      instance.ubuntu_pro_info?.result === "success" &&
      !instance.ubuntu_pro_info.attached,
  );
  assert(instanceWithoutToken);

  const props: ComponentProps<typeof UbuntuProEmptyState> = {
    instance: instanceWithoutToken,
  };

  it("renders empty state title", () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    expect(screen.getByText("No Ubuntu Pro entitlement")).toBeInTheDocument();
  });

  it("renders empty state body with description", () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    expect(
      screen.getByText(
        /This computer is not currently attached to an Ubuntu Pro entitlement/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /which provides additional security updates and other benefits from Canonical/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders learn more link", () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    const link = screen.getByRole("link", {
      name: "Learn more about Ubuntu Pro",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://ubuntu.com/pro");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });

  it("renders attach ubuntu pro button", () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    const button = screen.getByRole("button", { name: "Attach Ubuntu Pro" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("p-button--positive");
  });

  it("opens side panel with attach token form when button is clicked", async () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    const button = screen.getByRole("button", { name: "Attach Ubuntu Pro" });
    await userEvent.click(button);

    expect(
      screen.getByRole("heading", { name: "Attach Ubuntu Pro token" }),
    ).toBeInTheDocument();

    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
  });

  it("passes correct instance to attach form", async () => {
    const [, customInstance] = instances.filter(
      (instance) =>
        instance.ubuntu_pro_info?.result === "success" &&
        !instance.ubuntu_pro_info.attached,
    );
    assert(customInstance);

    renderWithProviders(<UbuntuProEmptyState instance={customInstance} />);

    const button = screen.getByRole("button", { name: "Attach Ubuntu Pro" });
    await userEvent.click(button);

    expect(
      screen.getByRole("heading", { name: "Attach Ubuntu Pro token" }),
    ).toBeInTheDocument();
  });

  it("lazy loads the attach token form", async () => {
    renderWithProviders(<UbuntuProEmptyState {...props} />);

    const button = screen.getByRole("button", { name: "Attach Ubuntu Pro" });
    await userEvent.click(button);

    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
  });
});
