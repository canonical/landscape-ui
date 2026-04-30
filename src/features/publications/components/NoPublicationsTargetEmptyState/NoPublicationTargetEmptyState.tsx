import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import { DOCUMENTATION_URL } from "./constants";

const NoPublicationTargetEmptyState = () => {
  const { createPageParamsSetter } = usePageParams();
  const handleAdd = createPageParamsSetter({
    sidePath: ["add-target"],
    name: "",
  });

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
