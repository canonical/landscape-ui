import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { useGetMirror } from "../../api";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import RadioGroup from "@/components/form/RadioGroup";
import { useFormik } from "formik";
import type { FormProps } from "./types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

const PublishMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { name, sidePath, popSidePath, createPageParamsSetter } =
    usePageParams();

  const mirror = useGetMirror(decodeURIComponent(name)).data.data;

  const close = createPageParamsSetter({ sidePath: [], name: "" });

  const formik = useFormik<FormProps>({
    initialValues: {
      publishTo: "new-publication",
    },
    onSubmit: async (values) => {
      try {
        close();

        switch (values.publishTo) {
          case "new-publication":
            notify.success({
              title: `You have marked ${mirror.displayName} to be published.`,
              message:
                "A publication has been created and an activity has been queued to publish it to the designated target.",
            });
            break;

          case "existing-publication":
            notify.success({
              title: `You have marked ${mirror.displayName} to be published.`,
              message:
                "The mirror will be added to the publication and an activity has been queued to publish it to the designated target.",
            });
            break;
        }
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <>
      <SidePanel.Header>Publish {mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <Blocks>
          <Blocks.Item>
            <RadioGroup field="publishTo" formik={formik} label="Publish to" />
          </Blocks.Item>
        </Blocks>
        <SidePanelFormButtons
          submitButtonText="Publish mirror"
          onCancel={close}
          hasBackButton={sidePath.length > 1}
          onBackButtonPress={popSidePath}
        />
      </SidePanel.Content>
    </>
  );
};

export default PublishMirrorForm;
