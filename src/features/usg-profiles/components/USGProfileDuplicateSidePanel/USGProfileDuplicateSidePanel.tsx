import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useAddUsgProfile } from "../../api";
import { useGetPageUsgProfile } from "../../api/useGetPageUsgProfile";
import { getInitialValues, notifyCreation } from "../../helpers";
import USGProfileForm from "../USGProfileForm";

const USGProfileDuplicateSidePanel: FC = () => {
  const { notify } = useNotify();
  const { sidePath, popSidePath } = usePageParams();

  const { usgProfile, isGettingUsgProfile } = useGetPageUsgProfile();
  const { addUsgProfile, isUsgProfileAdding } = useAddUsgProfile();

  if (isGettingUsgProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Duplicate {usgProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <USGProfileForm
          formMode="add"
          confirmationStepDescription="To duplicate the profile, you need to run it."
          initialValues={{
            ...getInitialValues(usgProfile),
            title: `${usgProfile.title} copy`,
          }}
          mutate={async (values) => {
            addUsgProfile({
              access_group: values.access_group,
              all_computers: values.all_computers,
              benchmark: values.benchmark,
              mode: values.mode,
              restart_deliver_delay: values.restart_deliver_delay,
              restart_deliver_delay_window: values.restart_deliver_delay_window,
              schedule: values.schedule,
              start_date: values.start_date,
              tags: values.tags,
              tailoring_file: values.tailoring_file,
              title: values.title,
            });
          }}
          onSuccess={(values) => {
            notifyCreation(values, notify);
          }}
          submitButtonText="Duplicate"
          submitting={isUsgProfileAdding}
          hasBackButton={sidePath.length > 1}
          onBackButtonPress={popSidePath}
        />
        ;
      </SidePanel.Content>
    </>
  );
};

export default USGProfileDuplicateSidePanel;
