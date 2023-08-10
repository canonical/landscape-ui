import { FC, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import MachinesContainer from "./MachinesContainer";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";
import { searchAndFilterData } from "../../../data/machines";

const MachinesPage: FC = () => {
  const [visualTitle, setVisualTitle] = useState("");
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    SearchAndFilterChip[]
  >([]);

  return (
    <PageMain>
      <PageHeader
        title="Machines"
        hideTitle
        visualTitle={visualTitle}
        search={{
          filterPanelData: searchAndFilterData,
          returnSearchData: setSearchAndFilterChips,
        }}
      />
      <PageContent>
        <MachinesContainer
          searchAndFilterChips={searchAndFilterChips}
          setVisualTitle={setVisualTitle}
        />
      </PageContent>
    </PageMain>
  );
};

export default MachinesPage;
