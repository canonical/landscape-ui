import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { FormikContextType } from "formik";
import { describe, it } from "vitest";
import type { DeliveryProps } from "./DeliveryBlock";
import DeliveryBlock from "./DeliveryBlock";

describe("DeliveryBlock", () => {
  const formik = {
    values: {
      deliverImmediately: true,
    },
    setFieldValue: vi.fn(),
    getFieldProps: vi.fn(() => ({
      name: "deliver_after",
      value: "",
      onChange: vi.fn(),
      onBlur: vi.fn(),
    })),
  } as unknown as FormikContextType<DeliveryProps>;

  const formikWithScheduledDelivery = {
    ...formik,
    values: {
      ...formik.values,
      deliverImmediately: false,
    },
    touched: {},
    errors: {},
  } as unknown as FormikContextType<DeliveryProps>;

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
