import EmptyState from "@/components/layout/EmptyState";
import { Button, Icon } from "@canonical/react-components";
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
