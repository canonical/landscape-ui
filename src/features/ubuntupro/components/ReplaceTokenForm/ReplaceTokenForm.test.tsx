import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";
import { UBUNTU_PRO_DASHBOARD_URL } from "../TokenFormBase";
import ReplaceTokenForm from "./ReplaceTokenForm";

describe("ReplaceTokenForm", () => {
  const props: ComponentProps<typeof ReplaceTokenForm> = {
    selectedInstances: instances
      .filter(
        (instance) =>
          instance.ubuntu_pro_info?.result === "success" &&
          instance.ubuntu_pro_info.attached,
      )
      .slice(0, 2),
  };

  it("renders the form with token input", () => {
    renderWithProviders(<ReplaceTokenForm {...props} />);

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /replace/i }),
    ).toBeInTheDocument();
  });

  it("renders Ubuntu Pro dashboard link", () => {
    renderWithProviders(<ReplaceTokenForm {...props} />);

    const link = screen.getByRole("link", { name: /ubuntu pro dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", UBUNTU_PRO_DASHBOARD_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("disables submit button when form is pristine", () => {
    renderWithProviders(<ReplaceTokenForm {...props} />);

    const submitButton = screen.getByRole("button", { name: /replace/i });
    expect(submitButton).toBeDisabled();
  });

  it("renders cancel button", () => {
    renderWithProviders(<ReplaceTokenForm {...props} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("renders with instances that have attached tokens", () => {
    const selectedInstances = instances.filter(
      (instance) =>
        instance.ubuntu_pro_info?.result === "success" &&
        instance.ubuntu_pro_info.attached,
    );

    expect(selectedInstances.length).toBeGreaterThan(0);

    renderWithProviders(
      <ReplaceTokenForm selectedInstances={selectedInstances} />,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /replace/i }),
    ).toBeInTheDocument();
  });
});
