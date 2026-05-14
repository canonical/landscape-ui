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
      error={getFormikError(formik, ["swift", "container"])}
      {...formik.getFieldProps("swift.container")}
    />
    <Input
      type="text"
      label="Username"
      required
      autoComplete="off"
      error={getFormikError(formik, ["swift", "username"])}
      {...formik.getFieldProps("swift.username")}
    />
    <Input
      type="password"
      label="Password"
      autoComplete="new-password"
      required
      error={getFormikError(formik, ["swift", "password"])}
      {...formik.getFieldProps("swift.password")}
    />
    <Input
      type="text"
      label="Auth URL"
      required
      error={getFormikError(formik, ["swift", "authUrl"])}
      {...formik.getFieldProps("swift.authUrl")}
    />
    <Input
      type="text"
      label="Prefix"
      error={getFormikError(formik, ["swift", "prefix"])}
      {...formik.getFieldProps("swift.prefix")}
    />
    <Input
      type="text"
      label="Tenant"
      error={getFormikError(formik, ["swift", "tenant"])}
      {...formik.getFieldProps("swift.tenant")}
    />
    <Input
      type="text"
      label="Tenant ID"
      error={getFormikError(formik, ["swift", "tenantId"])}
      {...formik.getFieldProps("swift.tenantId")}
    />
    <Input
      type="text"
      label="OpenStack domain name"
      error={getFormikError(formik, ["swift", "domain"])}
      {...formik.getFieldProps("swift.domain")}
    />
    <Input
      type="text"
      label="OpenStack domain ID"
      error={getFormikError(formik, ["swift", "domainId"])}
      {...formik.getFieldProps("swift.domainId")}
    />
    <Input
      type="text"
      label="OpenStack tenant domain"
      error={getFormikError(formik, ["swift", "tenantDomain"])}
      {...formik.getFieldProps("swift.tenantDomain")}
    />
    <Input
      type="text"
      label="OpenStack tenant domain ID"
      error={getFormikError(formik, ["swift", "tenantDomainId"])}
      {...formik.getFieldProps("swift.tenantDomainId")}
    />
  </div>
);

export default SwiftFields;
