import type { FormikContextType } from "formik";
import { vi } from "vitest";

export const createFormik = <T extends object>(
  values: T,
): FormikContextType<T> => {
  const mutableValues = values as Record<string, unknown>;

  const setFieldValue = vi.fn(
    async (field: string, value: unknown): Promise<void> => {
      mutableValues[field] = value;
    },
  );

  return {
    values: values as T,
    touched: {},
    errors: {},
    setFieldValue,
    getFieldProps: vi.fn((field: keyof T) => ({
      name: field,
      value: mutableValues[String(field)],
      onChange: vi.fn(),
      onBlur: vi.fn(),
    })),
  } as unknown as FormikContextType<T>;
};
