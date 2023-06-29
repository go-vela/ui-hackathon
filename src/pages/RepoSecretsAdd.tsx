import { Helmet } from "react-helmet-async";
import { TopBumper } from "../components/TopBumper";
import { useOrgRepoParams } from "../library/hooks/useOrgRepoParams";
import { RepoSecretsAddEditWidget } from "../components/RepoSecretsAddEditWidget";

export function RepoSecretsAdd() {
  const { org, repo } = useOrgRepoParams();
  return (
    <>
      <Helmet>
        <title>{`Add Native Secret - Secrets - ${org}/${repo} - Vela`}</title>
      </Helmet>
      <TopBumper />
      <div>
        <RepoSecretsAddEditWidget org={org!} repo={repo!} mode="add" />
        <div className="py-4"></div>
      </div>
    </>
  );
}
