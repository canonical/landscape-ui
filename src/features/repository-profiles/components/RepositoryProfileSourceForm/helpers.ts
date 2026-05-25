import * as Yup from "yup";

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
      .matches(
        /^(deb|deb-src)\s+\S+/,
        'Must start with "deb" or "deb-src" followed by a URL.',
      ),
    gpg_key_name: Yup.string(),
  });
