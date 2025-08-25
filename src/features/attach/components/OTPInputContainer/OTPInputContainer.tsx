import useDebug from "@/hooks/useDebug";
import AuthTemplate from "@/templates/auth";
import { Button, Form } from "@canonical/react-components";
import { useFormik } from "formik";
import { type FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useVerifyOtpCode } from "../../api";
import { OTP_LENGTH } from "../../constants";
import OTPInput from "../OTPInput";
import classes from "./OTPInputContainer.module.scss";
import type { FormikProps } from "./types";
import { getFormikError } from "@/utils/formikErrors";
import * as Yup from "yup";

const OTPInputContainer: FC = () => {
  const [searchParams] = useSearchParams();
  const debug = useDebug();
  const navigate = useNavigate();

  const { verify, isVerifying } = useVerifyOtpCode();

  const code = searchParams.get("code") || "";

  const formik = useFormik<FormikProps>({
    initialValues: {
      code: Object.assign(Array(OTP_LENGTH).fill(""), code?.split("") || []),
    },
    validationSchema: Yup.object().shape({
      code: Yup.array().test(
        "is-complete",
        `Code must be ${OTP_LENGTH} characters long`,
        (value) => {
          return value != null && value.every((digit) => digit && digit !== "");
        },
      ),
    }),
    enableReinitialize: true,
    onSubmit: async (values: FormikProps) => {
      try {
        const attachCode = values.code.join("");

        const { data } = await verify({
          attach_code: attachCode,
        });

        if (!data.valid) {
          debug("The code you entered has expired and is no longer valid.");
          formik.resetForm({
            values: { code: Array(OTP_LENGTH).fill("") },
          });

          return;
        }

        navigate(`/login?code=${attachCode}`);
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    const isCompleteOnLoad =
      code &&
      code.length === OTP_LENGTH &&
      code.split("").every((digit) => digit && digit !== "");

    if (isCompleteOnLoad) {
      formik.submitForm();
    }
  }, []);

  const handleInputChange = (value: string[]) => {
    formik.setFieldValue("code", value);
  };

  return (
    <AuthTemplate title="Enter code to connect to the Ubuntu installer">
      <Form onSubmit={formik.handleSubmit}>
        <OTPInput
          value={formik.values.code}
          onChange={handleInputChange}
          onComplete={formik.submitForm}
          error={getFormikError(formik, "code")}
        />
        <div className={classes.buttonContainer}>
          <Button
            className="u-no-margin--bottom"
            type="submit"
            appearance="positive"
            disabled={formik.isSubmitting || isVerifying}
          >
            Next
          </Button>
        </div>
      </Form>
    </AuthTemplate>
  );
};

export default OTPInputContainer;
