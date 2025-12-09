import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import type { FC } from "react";
import { Suspense, useMemo, useState } from "react";
import { useGetSavedSearches } from "../../api";
import CreateSavedSearchButton from "../CreateSavedSearchButton";
import SavedSearchesSidePanelList from "../SavedSearchesSidePanelList";
import useSidePanel from "@/hooks/useSidePanel";
import { SIDEPANEL_SIZE } from "../../constants";

const ManageSavedSearchesSidePanel: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { savedSearches, isLoadingSavedSearches } = useGetSavedSearches();

  const { setSidePanelContent } = useSidePanel();

  const paginatedSavedSearches = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return savedSearches.slice(startIndex, endIndex);
  }, [savedSearches, currentPage, pageSize]);

  if (isLoadingSavedSearches) {
    return <LoadingState />;
  }

  return (
    <div>
      <CreateSavedSearchButton
        onBackButtonPress={() => {
          setSidePanelContent(
            "Manage saved searches",
            <Suspense fallback={<LoadingState />}>
              <ManageSavedSearchesSidePanel />
            </Suspense>,
            SIDEPANEL_SIZE,
          );
        }}
      />
      <SavedSearchesSidePanelList savedSearches={paginatedSavedSearches} />
      <SidePanelTablePagination
        currentPage={currentPage}
        totalItems={savedSearches.length}
        pageSize={pageSize}
        paginate={(page: number) => {
          setCurrentPage(page);
        }}
        setPageSize={(newPageSize: number) => {
          setPageSize(newPageSize);
        }}
      />
    </div>
  );
};

export default ManageSavedSearchesSidePanel;
