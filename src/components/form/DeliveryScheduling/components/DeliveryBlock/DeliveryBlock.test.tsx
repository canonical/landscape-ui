import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

  it("sets scheduled delivery using a local datetime value", async () => {
    renderWithProviders(<DeliveryBlock formik={formik} />);
    const expectedEarliestTime =
      Math.floor((Date.now() + 5 * 60 * 1000) / (60 * 1000)) * (60 * 1000);

    await userEvent.click(screen.getByRole("radio", { name: /scheduled/i }));

    const expectedLatestTime =
      Math.floor((Date.now() + 5 * 60 * 1000) / (60 * 1000)) * (60 * 1000);
    const scheduledTime = new Date(formik.values.deliver_after).getTime();

    expect(scheduledTime).toBeGreaterThanOrEqual(expectedEarliestTime);
    expect(scheduledTime).toBeLessThanOrEqual(expectedLatestTime);
  });
});
