import * as Yup from "yup";

// Mirrors the server's python-apt check: type, optional [options], URI, suite.
export const isValidDebLine = (line: string): boolean => {
  const [withoutComment = ""] = line.split("#");
  const withoutOptions = withoutComment.replace(/^(\s*\S+)\s+\[[^\]]*\]/, "$1");
  const [type, ...rest] = withoutOptions.trim().split(/\s+/);

  return (type === "deb" || type === "deb-src") && rest.length >= 2;
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
        'Must be a valid APT line: "deb" or "deb-src", a URL, and a suite (e.g. deb http://example.com/ubuntu focal main).',
        (value) => !value || isValidDebLine(value),
      ),
    gpg_key_name: Yup.string(),
  });
