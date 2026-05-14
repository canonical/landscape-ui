import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { createFormik } from "@/tests/formik";
import type { DeliveryProps } from "./DeliveryBlock";
import DeliveryBlock from "./DeliveryBlock";

describe("DeliveryBlock", () => {
  const formik = createFormik<DeliveryProps>({
    deliver_immediately: true,
    deliver_after: "",
  });

  const formikWithScheduledDelivery = createFormik<DeliveryProps>({
    deliver_immediately: false,
    deliver_after: "2026-03-17T12:00",
  });

  it("should display delivery block", async () => {
    renderWithProviders(<DeliveryBlock formik={formik} />);

    expect(screen.getByText(/delivery time/i)).toBeInTheDocument();

    const immediateDeliveryInput = screen.getByRole("radio", {
      name: /as soon as possible/i,
    });
    const scheduledDeliveryInput = screen.getByRole("radio", {
      name: /scheduled/i,
    });
    expect(immediateDeliveryInput).toBeInTheDocument();
    expect(scheduledDeliveryInput).toBeInTheDocument();
    expect(immediateDeliveryInput).toBeChecked();
    expect(scheduledDeliveryInput).not.toBeChecked();
    expect(screen.queryByText(/deliver after/i)).not.toBeInTheDocument();
  });

  it("should display delivery block with scheduled delivery", async () => {
    renderWithProviders(<DeliveryBlock formik={formikWithScheduledDelivery} />);

    expect(screen.getByText(/delivery time/i)).toBeInTheDocument();

    const immediateDeliveryInput = screen.getByRole("radio", {
      name: /as soon as possible/i,
    });
    const scheduledDeliveryInput = screen.getByRole("radio", {
      name: /scheduled/i,
    });
    expect(immediateDeliveryInput).toBeInTheDocument();
    expect(scheduledDeliveryInput).toBeInTheDocument();
    expect(scheduledDeliveryInput).toBeChecked();
    expect(immediateDeliveryInput).not.toBeChecked();

    expect(screen.queryByText(/deliver after/i)).toBeInTheDocument();
  });
});
