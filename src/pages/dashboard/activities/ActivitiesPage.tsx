import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { ActivityCommon } from "@/features/activities";
import { Activities, ActivitiesActions } from "@/features/activities";
import type { FC } from "react";
import { useState } from "react";
import classes from "./ActivitiesPage.module.scss";

const ActivitiesPage: FC = () => {
  const [selected, setSelected] = useState<ActivityCommon[]>([]);

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        className={classes.header}
        actions={[
          <ActivitiesActions selected={selected} key="activities-actions" />,
        ]}
      />
      <PageContent>
        <Activities selected={selected} setSelected={setSelected} />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
