import Blocks from "@/components/layout/Blocks";
import SidePanel from "@/components/layout/SidePanel";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { ProfileTypes, ViewProfileGeneralBlock } from "@/features/profiles";
import {
  type APTSource,
  useGetRepositoryProfile,
} from "@/features/repository-profiles";
import usePageParams from "@/hooks/usePageParams";
import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { Column } from "react-table";

const SOURCES_PAGE_SIZE = 10;

const APT_SOURCE_COLUMNS: Column<APTSource>[] = [
  { accessor: "name", Header: "Source" },
  { accessor: "line", Header: "Deb line" },
];

/** A repository profile's details and sources, read-only. */
const SupportRepositoryProfileSidePanel: FC = () => {
  const { name } = usePageParams();
  const { data: profile } = useGetRepositoryProfile(name);

  const [sourcesPage, setSourcesPage] = useState(1);

  const totalSourcePages = Math.max(
    1,
    Math.ceil(profile.apt_sources.length / SOURCES_PAGE_SIZE),
  );
  const safeSourcesPage = Math.min(sourcesPage, totalSourcePages);

  const pagedSources = useMemo(
    () =>
      profile.apt_sources.slice(
        (safeSourcesPage - 1) * SOURCES_PAGE_SIZE,
        safeSourcesPage * SOURCES_PAGE_SIZE,
      ),
    [profile.apt_sources, safeSourcesPage],
  );

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <Blocks>
          <ViewProfileGeneralBlock
            profile={profile}
            type={ProfileTypes.repository}
          />
          <Blocks.Item title="Sources">
            <ModularTable
              columns={APT_SOURCE_COLUMNS}
              data={pagedSources}
              emptyMsg="No sources have been added yet."
            />
            <ModalTablePagination
              current={safeSourcesPage}
              max={totalSourcePages}
              onPrev={() => {
                setSourcesPage(safeSourcesPage - 1);
              }}
              onNext={() => {
                setSourcesPage(safeSourcesPage + 1);
              }}
            />
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
    </>
  );
};

export default SupportRepositoryProfileSidePanel;
