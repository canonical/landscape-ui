import EmptyState from "@/components/layout/EmptyState";
import { Button, Icon } from "@canonical/react-components";
import { DOCUMENTATION_URL } from "./constants";
import { useNavigate } from "react-router";
import { ROUTES } from "@/libs/routes";

const NoPublicationTargetEmptyState = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(
      ROUTES.repositories.publicationTargets({
        sidePath: ["add"],
      }),
    );
  };

  return (
    <EmptyState
      title="You must first add a publication target in order to add a publication"
      body={
        <>
          <p>
            On this page you will find all publications created when publishing
            a mirror or a local repository.
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
      cta={[
        <Button
          appearance="positive"
          hasIcon
          key="add-publication-target-button"
          onClick={handleAdd}
          type="button"
        >
          <Icon name="plus" light />
          <span>Add publication target</span>
        </Button>,
      ]}
    />
  );
};

export default NoPublicationTargetEmptyState;
