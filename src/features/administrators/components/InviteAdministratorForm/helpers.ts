import * as Yup from "yup";
import { emailSchema, normalizeEmail } from "@/utils/validation/email";
import type { Invitation } from "../../types/Invitation";

export const getValidationSchema = (invitations: Invitation[]) => {
  return Yup.object().shape({
    email: emailSchema()
      .required("This field is required.")
      .test({
        name: "unique-email",
        params: { invitations },
        test: (value, { createError, parent }) => {
          const existInvitation = invitations.find(
            ({ email }) =>
              !!value && normalizeEmail(email) === normalizeEmail(value),
          );

          return (
            !existInvitation ||
            createError({
              message: `${parent.name ?? existInvitation.name} is already invited to this account`,
            })
          );
        },
      }),
    name: Yup.string().required("This field is required."),
    roles: Yup.array().of(Yup.string()),
  });
};
