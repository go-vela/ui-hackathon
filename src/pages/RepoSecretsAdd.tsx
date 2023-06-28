import { Helmet } from "react-helmet-async";
import { TopBumper } from "../components/TopBumper";
import { useOrgRepoParams } from "../library/hooks/useOrgRepoParams";
import { RepoSecretsAddWidget } from "../components/RepoSecretsAddWidget";

export function RepoSecretsAdd() {
  const { org, repo } = useOrgRepoParams();
  return (
    <>
      <Helmet>
        <title>{`Secrets - ${org}/${repo} - Add Native Secret - Vela`}</title>
      </Helmet>
      <TopBumper />
      <div>
        <RepoSecretsAddWidget org={org!} repo={repo!} />
        <div className="py-4"></div>
      </div>
    </>
  );
}
