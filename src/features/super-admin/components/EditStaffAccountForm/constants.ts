import * as Yup from "yup";
import { SIZE_UNITS, toBytes, type SizeUnit } from "@/utils/size";

// The rules below mirror `AccountPatchBody` and `set_account_subdomain` on the
// server, so a value the server would reject is caught before it is sent.

export const MAX_PEOPLE_COUNT_MIN = 1;
export const MAX_PEOPLE_COUNT_MAX = 100;

export const SUBDOMAIN_MIN_LENGTH = 2;
export const SUBDOMAIN_MAX_LENGTH = 63;

/** Dot-separated DNS labels per RFC 1034 section 3.1, e.g. `tenant.saas`. */
export const SUBDOMAIN_PATTERN =
  /^[a-z]([a-z0-9-]*[a-z0-9])?(\.[a-z]([a-z0-9-]*[a-z0-9])?)*$/;

export const DISALLOWED_SUBDOMAINS = ["landscape", "saas"];

const INTEGER_MESSAGE = "Enter a whole number.";
const REQUIRED_MESSAGE = "This field is required.";

export const VALIDATION_SCHEMA = Yup.object().shape({
  subdomain: Yup.string()
    .trim()
    .test(
      "length",
      `A subdomain must be ${SUBDOMAIN_MIN_LENGTH} to ${SUBDOMAIN_MAX_LENGTH} characters long.`,
      (value) =>
        !value ||
        (value.length >= SUBDOMAIN_MIN_LENGTH &&
          value.length <= SUBDOMAIN_MAX_LENGTH),
    )
    .matches(SUBDOMAIN_PATTERN, {
      message:
        "Use lowercase letters, digits and hyphens. Each dot-separated label must start with a letter and cannot end with a hyphen.",
      excludeEmptyString: true,
    })
    .notOneOf(
      DISALLOWED_SUBDOMAINS,
      `The subdomain cannot be ${DISALLOWED_SUBDOMAINS.map((subdomain) => `"${subdomain}"`).join(" or ")}.`,
    ),
  salesforce_account_key: Yup.string(),
  max_people_count: Yup.number()
    .typeError(REQUIRED_MESSAGE)
    .required(REQUIRED_MESSAGE)
    .integer(INTEGER_MESSAGE)
    .min(
      MAX_PEOPLE_COUNT_MIN,
      `Enter a number from ${MAX_PEOPLE_COUNT_MIN} to ${MAX_PEOPLE_COUNT_MAX}.`,
    )
    .max(
      MAX_PEOPLE_COUNT_MAX,
      `Enter a number from ${MAX_PEOPLE_COUNT_MIN} to ${MAX_PEOPLE_COUNT_MAX}.`,
    ),
  max_attachment_size: Yup.number()
    .typeError(REQUIRED_MESSAGE)
    .required(REQUIRED_MESSAGE)
    .min(0, "Enter 0 or more.")
    .test(
      "whole-bytes",
      "Enter a size that is a whole number of bytes.",
      (value, { parent }) =>
        value === undefined ||
        Number.isInteger(
          toBytes({
            value,
            unit: (parent as { max_attachment_size_unit: SizeUnit })
              .max_attachment_size_unit,
          }),
        ),
    ),
  max_attachment_size_unit: Yup.string().oneOf(
    SIZE_UNITS.map(({ value }) => value),
  ),
});
