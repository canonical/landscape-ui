import EmptyState from "@/components/layout/EmptyState";
import AddPublicationButton from "../AddPublicationButton";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

const NoPublicationsEmptyState = () => {
  return (
    <EmptyState
      title="You don’t have any publications yet"
      body="On this page you will find all publications created when publishing a mirror or a local repository."
      link={{
        href: DEBARCHIVE_DOCUMENTATION_URL,
        text: "Learn more about repository mirroring",
      }}
      cta={[<AddPublicationButton key="add-publication-button" />]}
    />
  );
};

export default NoPublicationsEmptyState;
