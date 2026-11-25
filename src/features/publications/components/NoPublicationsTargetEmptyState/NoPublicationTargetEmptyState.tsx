import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-ds-global";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";
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
      body="On this page you will find all publications created when publishing a mirror or a local repository."
      link={{
        href: DEBARCHIVE_DOCUMENTATION_URL,
        text: "Learn more about repository mirroring",
      }}
      cta={[
        <Button
          key="add-publication-target-button"
          type="button"
          importance="primary"
          anticipation="constructive"
          icon="plus"
          onClick={handleAdd}
        >
          Add publication target
        </Button>,
      ]}
    />
  );
};

export default NoPublicationTargetEmptyState;
