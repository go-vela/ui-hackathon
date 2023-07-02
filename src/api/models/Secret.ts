/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { PipelineContainer } from "./PipelineContainer";

// TODO: what is going on with this type? does not match the given data at all
export type Secret = {
  name?: string;
  value?: string;
  key?: string;
  engine?: string;
  type?: string;
  origin?: PipelineContainer;
};

export type SecretPost = {
  org: string;
  repo: string;
  team: string | null;
  name: string;
  value: string | null; // we could probably omit this
  type: "shared" | "org" | "repo"; // there are 3 types
  images: string[];
  events: ("pull_request" | "push" | "tag" | "comment" | "deployment")[];
  allow_command: boolean;
};

// here is a corrected type that is based on the actual response from org/repo
export type SecretCorrected = {
  id: number;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
} & SecretPost;
