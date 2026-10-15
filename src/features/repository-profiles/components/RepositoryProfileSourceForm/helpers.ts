import * as Yup from "yup";

// Stricter than the server, which does not check that the URI has a scheme.
const URI_PATTERN = /^[a-z][a-z0-9+.-]*:\S+$/i;

export const isValidDebLine = (line: string): boolean => {
  const [content = ""] = line.split("#");
  const [type, ...tokens] = content.trim().split(/\s+/);

  if (type !== "deb" && type !== "deb-src") {
    return false;
  }

  if (tokens[0]?.startsWith("[")) {
    const end = tokens.findIndex((token) => token.endsWith("]"));
    const closing = end === -1 ? undefined : tokens[end];

    if (
      end === -1 ||
      !closing ||
      closing.indexOf("]") !== closing.length - 1 ||
      tokens.slice(0, end).some((token) => token.includes("]"))
    ) {
      return false;
    }

    tokens.splice(0, end + 1);
  }
  return !!uri && URI_PATTERN.test(uri) && !!suite;
};

export const getValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .required("This field is required.")
      .matches(
        /^[a-z0-9][a-z0-9+.-]*$/,
        "Name must start with alphanumeric and contain only lowercase letters, numbers, -, or +.",
      ),
    deb_line: Yup.string()
      .required("This field is required.")
      .test(
        "valid-deb-line",
        'Must be a valid APT line: "deb" or "deb-src", a repository URI with a scheme (e.g. https://, s3://), and a suite.',
        (value) => !value || isValidDebLine(value),
      ),
    gpg_key_name: Yup.string(),
  });
