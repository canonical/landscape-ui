import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useGetSavedSearches } from "../../api";
import CreateSavedSearchButton from "../CreateSavedSearchButton";
import SavedSearchesSidePanelList from "../SavedSearchesSidePanelList";

const ManageSavedSearchesSidePanel: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const { savedSearches, isLoadingSavedSearches } = useGetSavedSearches();

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
      <CreateSavedSearchButton isInSidePanel={true} />
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
