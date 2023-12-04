import { FC } from "react";
import PageContent from "../../../components/layout/PageContent";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import useAuth from "../../../hooks/useAuth";

const UserPage: FC = () => {
  const { user } = useAuth();

  return (
    <PageMain>
      <PageHeader title={user!.name} />
      <PageContent>
        <div>
          <p>{user?.email}</p>
        </div>
      </PageContent>
    </PageMain>
  );
};

export default UserPage;
