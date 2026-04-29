import { getFormikError } from "@/utils/formikErrors";
import { Input } from "@canonical/react-components";
import type { FormikProps } from "formik";
import type { FC } from "react";
import type { AddPublicationTargetFormValues } from "../AddPublicationTargetForm/constants";
import styles from "./TargetTypeFields.module.scss";

interface SwiftFieldsProps {
  readonly formik: FormikProps<AddPublicationTargetFormValues>;
}

const SwiftFields: FC<SwiftFieldsProps> = ({ formik }) => (
  <div className={styles.typeFieldsIndent}>
    <Input
      type="text"
      label="Container"
      required
      error={getFormikError(formik, "container")}
      {...formik.getFieldProps("container")}
    />
    <Input
      type="text"
      label="Username"
      required
      error={getFormikError(formik, "swiftUsername")}
      {...formik.getFieldProps("swiftUsername")}
    />
    <Input
      type="password"
      label="Password"
      required
      error={getFormikError(formik, "swiftPassword")}
      {...formik.getFieldProps("swiftPassword")}
    />
    <Input
      type="text"
      label="Auth URL"
      required
      error={getFormikError(formik, "authUrl")}
      {...formik.getFieldProps("authUrl")}
    />
    <Input
      type="text"
      label="Prefix"
      error={getFormikError(formik, "swiftPrefix")}
      {...formik.getFieldProps("swiftPrefix")}
    />
    <Input
      type="text"
      label="Tenant"
      error={getFormikError(formik, "tenant")}
      {...formik.getFieldProps("tenant")}
    />
    <Input
      type="text"
      label="Tenant ID"
      error={getFormikError(formik, "tenantId")}
      {...formik.getFieldProps("tenantId")}
    />
    <Input
      type="text"
      label="OpenStack domain name"
      error={getFormikError(formik, "domain")}
      {...formik.getFieldProps("domain")}
    />
    <Input
      type="text"
      label="OpenStack domain ID"
      error={getFormikError(formik, "domainId")}
      {...formik.getFieldProps("domainId")}
    />
    <Input
      type="text"
      label="OpenStack tenant domain"
      error={getFormikError(formik, "tenantDomain")}
      {...formik.getFieldProps("tenantDomain")}
    />
    <Input
      type="text"
      label="OpenStack tenant domain ID"
      error={getFormikError(formik, "tenantDomainId")}
      {...formik.getFieldProps("tenantDomainId")}
    />
  </div>
);

export default SwiftFields;
