import { useQuery } from "@tanstack/react-query";
import { ApiError, SecretsService } from "../api";
import { IconCopy } from "./IconCopy";
import { Loader } from "./Loader";
import { IconGear } from "./IconGear";
import { Table } from "./Table";
import { Link } from "react-router-dom";

export interface RepoSecretsWidgetProps {
  org: string;
  repo: string;
}
export function RepoSecretsWidget({ org, repo }: RepoSecretsWidgetProps) {
  const repoSecretsQuery = useQuery({
    queryKey: ["repo-secrets", org, repo],
    queryFn: () =>
      // fairly unlikely that the repo has more than 100 secrets; this way we don't need paging
      SecretsService.getSecrets("native", "repo", org!, repo!, 1, 100),
  });

  function handleCopyToClipboard(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (navigator && navigator.clipboard) {
      const name = "name";
      const key = "key";
      const engine = "engine";
      const type = "type";

      const toCopy = `
      - name: "${name}"
        key: "${key}"
        engine: "${engine}"
        type: "${type}"
      `;

      navigator.clipboard.writeText(toCopy);
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Repo Secrets</h2>
          {repoSecretsQuery.isLoading ? <Loader /> : null}
        </div>
        <div>
          {repoSecretsQuery.isSuccess && !repoSecretsQuery.isError ? (
            <>
              <Link
                to={`/${org}/${repo}/$/secrets/native/add`}
                className="btn-secondary flex items-center gap-2"
              >
                Add Repo Secret
                <span className="inline-block h-6 w-6">
                  <IconGear />
                </span>
              </Link>
            </>
          ) : null}
        </div>
      </div>
      {repoSecretsQuery.isError ? (
        <>
          <div className="space-y-4">
            <p>
              There was an error fetching repo secrets for{" "}
              <code>
                {org}/{repo}
              </code>
              , please refresh or try again later!
            </p>

            <blockquote className="border-l-4 border-l-vela-red p-4">
              {repoSecretsQuery.error
                ? (repoSecretsQuery.error as ApiError).body.error
                : null}
            </blockquote>
          </div>
        </>
      ) : null}
      {repoSecretsQuery.isSuccess && !repoSecretsQuery.isError ? (
        <>
          {repoSecretsQuery.data.length === 0 ? (
            <>
              <p>
                There are no secrets repo{" "}
                <code>
                  {org}/{repo}
                </code>{" "}
                yet.
              </p>
            </>
          ) : (
            <Table
              head={
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Type</th>
                  <th>Events</th>
                  <th>Images</th>
                  <th>Allow Command</th>
                </tr>
              }
              body={
                <>
                  {repoSecretsQuery.data.map((secret) => {
                    return (
                      <tr key={secret.id}>
                        <td>
                          <button
                            onClick={handleCopyToClipboard}
                            type="button"
                            className="w-[3rem] pl-[1.25rem]"
                            title="copy secret yaml to clipboard"
                          >
                            <span className="block h-6 w-6">
                              <IconCopy />
                            </span>
                          </button>
                        </td>
                        <td>{secret.name}</td>
                        <td>
                          {secret.org}/{secret.repo}/{secret.name}
                        </td>
                        <td>{secret.type}</td>
                        <td className="font-mono">
                          {secret.events.join(", ")}
                        </td>
                        <td>
                          {secret.images.length === 0
                            ? "no images"
                            : secret.images.join(", ")}
                        </td>
                        <td>{secret.allow_command ? "yes" : "no"}</td>
                      </tr>
                    );
                  })}
                </>
              }
            />
          )}
        </>
      ) : null}
    </>
  );
}
