import * as Yup from "yup";
import type { Invitation } from "@/types/Invitation";

export const getValidationSchema = (invitations: Invitation[]) => {
  return Yup.object().shape({
    email: Yup.string()
      .required("This field is required.")
      .email("Please provide a valid email address")
      .test({
        name: "unique-email",
        params: { invitations },
        test: (value, { createError, parent }) => {
          const existInvitation = invitations.find(
            ({ email }) => email === value,
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
