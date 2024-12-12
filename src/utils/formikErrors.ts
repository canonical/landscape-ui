import { FormikErrors, FormikTouched } from "formik";

type NestedIndexType<T> =
  | []
  | (T extends (infer U)[]
      ? [number, ...NestedIndexType<U>]
      : T extends object
        ? { [K in keyof T]: [K] | [K, ...NestedIndexType<T[K]>] }[keyof T]
        : []);

type NestedIndexList<T> = Exclude<NestedIndexType<T>, []>;

export const getFormikError = <T>(
  {
    errors,
    touched,
  }: {
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  indexOrIndexList: (keyof T & string) | NestedIndexList<T>,
): string | undefined => {
  if (typeof indexOrIndexList === "string") {
    if (
      !touched[indexOrIndexList] ||
      !errors[indexOrIndexList] ||
      typeof errors[indexOrIndexList] !== "string"
    ) {
      return undefined;
    }

    return errors[indexOrIndexList];
  }

  let currentTouched: unknown = touched;
  let currentErrors: unknown = errors;

  for (const key of indexOrIndexList) {
    if (
      !currentTouched ||
      typeof currentTouched !== "object" ||
      !((key as string | number) in currentTouched) ||
      !currentErrors ||
      typeof currentErrors !== "object" ||
      !((key as string | number) in currentErrors)
    ) {
      return undefined;
    }

    currentTouched = currentTouched[key as keyof typeof currentTouched];
    currentErrors = currentErrors[key as keyof typeof currentErrors];
  }

  return currentTouched && currentErrors && typeof currentErrors === "string"
    ? currentErrors
    : undefined;
};
