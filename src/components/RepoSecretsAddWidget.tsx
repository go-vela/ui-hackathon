import { useQuery } from "@tanstack/react-query";
import { ApiError, SecretsService } from "../api";
import { IconCopy } from "./IconCopy";
import { Loader } from "./Loader";
import { IconGear } from "./IconGear";
import { Table } from "./Table";
import { Link } from "react-router-dom";

import * as Label from "@radix-ui/react-label";

export interface RepoSecretsAddWidgetProps {
  org: string;
  repo: string;
}

export function RepoSecretsAddWidget({ org, repo }: RepoSecretsAddWidgetProps) {
  return (
    <>
      <h2 className="border-b-2 border-b-vela-lavender text-2xl font-bold">
        Add Repo Secret
      </h2>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Label.Root className="LabelRoot" htmlFor="secretName">
              Name
            </Label.Root>
            <input
              className="Input"
              type="text"
              id="secretName"
              placeholder="Secret Name"
            />
          </div>
        </div>
      </div>
    </>
  );
}
