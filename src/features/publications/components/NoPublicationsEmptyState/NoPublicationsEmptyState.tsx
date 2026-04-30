import EmptyState from "@/components/layout/EmptyState";
import AddPublicationButton from "../AddPublicationButton";
import { DOCUMENTATION_URL } from "./constants";

const NoPublicationsEmptyState = () => {
  return (
    <EmptyState
      title="You don’t have any publications yet"
      body={
        <>
          <p>
            On this page you will find all publications created when publishing
            a mirror or a local repository.{" "}
          </p>
          <a
            href={DOCUMENTATION_URL}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn more about repository mirroring.
          </a>
        </>
      }
      cta={[<AddPublicationButton key="add-publication-button" />]}
    />
  );
};

export default NoPublicationsEmptyState;
