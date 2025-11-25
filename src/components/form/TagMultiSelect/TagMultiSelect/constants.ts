import * as Yup from "yup";

export const validationSchema = Yup.string()
  .matches(/^[a-zA-Z]/, {
    message: "Tag must starts with a letter",
    excludeEmptyString: true,
  })
  .matches(/^[a-zA-Z][a-zA-Z0-9_-]*$/, {
    message: "Tag can only contain letters, numbers, hyphens, and underscores",
    excludeEmptyString: true,
  });
