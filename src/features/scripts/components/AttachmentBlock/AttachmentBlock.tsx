import type { FormikContextType } from "formik";
import type { FC } from "react";
import { Input } from "@canonical/react-components";
import type { RunInstanceScriptFormValues } from "../../types";

interface AttachmentBlockProps {
  readonly formik: FormikContextType<RunInstanceScriptFormValues>;
}

const AttachmentBlock: FC<AttachmentBlockProps> = ({ formik }) => {
  return (
    <>
      <p className="p-heading--5">List of attachments</p>
      <p className="u-text--muted">
        Attachments that will be sent along with the script. You can attach up
        to 5 files, for a maximum of 1.00MB. Filenames must be unique. On the
        client, the attachments will be placed in the directory whose name is
        accessible through the environment variable LANDSCAPE_ATTACHMENTS.
        They&apos;ll be deleted once the script has been run.
      </p>

      <Input
        label="First attachment"
        labelClassName="u-off-screen"
        type="file"
        onChange={(event) =>
          formik.setFieldValue(
            "attachments.first",
            event.target.files?.[0] ?? null,
          )
        }
        error={
          formik.touched.attachments?.first && formik.errors.attachments?.first
            ? formik.errors.attachments?.first
            : undefined
        }
      />

      <Input
        label="Second attachment"
        labelClassName="u-off-screen"
        type="file"
        onChange={(event) =>
          formik.setFieldValue(
            "attachments.second",
            event.target.files?.[0] ?? null,
          )
        }
        error={
          formik.touched.attachments?.second &&
          formik.errors.attachments?.second
            ? formik.errors.attachments?.second
            : undefined
        }
      />

      <Input
        label="Third attachment"
        labelClassName="u-off-screen"
        type="file"
        onChange={(event) =>
          formik.setFieldValue(
            "attachments.third",
            event.target.files?.[0] ?? null,
          )
        }
        error={
          formik.touched.attachments?.third && formik.errors.attachments?.third
            ? formik.errors.attachments?.third
            : undefined
        }
      />

      <Input
        label="Fourth attachment"
        labelClassName="u-off-screen"
        type="file"
        onChange={(event) =>
          formik.setFieldValue(
            "attachments.fourth",
            event.target.files?.[0] ?? null,
          )
        }
        error={
          formik.touched.attachments?.fourth &&
          formik.errors.attachments?.fourth
            ? formik.errors.attachments?.fourth
            : undefined
        }
      />

      <Input
        label="Fifth attachment"
        labelClassName="u-off-screen"
        type="file"
        onChange={(event) =>
          formik.setFieldValue(
            "attachments.fifth",
            event.target.files?.[0] ?? null,
          )
        }
        error={
          formik.touched.attachments?.fifth && formik.errors.attachments?.fifth
            ? formik.errors.attachments?.fifth
            : undefined
        }
      />
    </>
  );
};

export default AttachmentBlock;
