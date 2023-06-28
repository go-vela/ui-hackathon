/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Secret, SecretCorrected, SecretPost } from "../models/Secret";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class SecretsService {
  /**
   * Retrieve a list of secrets from the configured backend
   * @param engine Secret engine to create a secret in, eg. "native"
   * @param type Secret type to create
   * @param org Name of the org
   * @param name Name of the repo if a repo secret, team name if a shared secret, or '*' if an org secret
   * @param page The page of results to retrieve
   * @param perPage How many results per page to return
   * @returns Secret Successfully retrieved the list of secrets
   * @throws ApiError
   */
  public static getSecrets(
    engine: string,
    type: "org" | "repo" | "shared",
    org: string,
    name: string,
    page: number = 1,
    perPage: number = 10
  ): CancelablePromise<Array<SecretCorrected>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/secrets/{engine}/{type}/{org}/{name}",
      path: {
        engine: engine,
        type: type,
        org: org,
        name: name,
      },
      query: {
        page: page,
        per_page: perPage,
      },
      errors: {
        400: `Unable to retrieve the list of secrets`,
        500: `Unable to retrieve the list of secrets`,
      },
    });
  }

  /**
   * Create a secret
   * @param engine Secret engine to create a secret in, eg. "native"
   * @param type Secret type to create
   * @param org Name of the org
   * @param name Name of the repo if a repo secret, team name if a shared secret, or '*' if an org secret
   * @param body Payload containing the secret to create
   * @returns Secret Successfully created the secret
   * @throws ApiError
   */
  public static createSecret(
    engine: string,
    type: "org" | "repo" | "shared",
    org: string,
    name: string,
    body: SecretPost // TODO actually fix the swagger docs so the generated code works
  ): CancelablePromise<Secret> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/secrets/{engine}/{type}/{org}/{name}",
      path: {
        engine: engine,
        type: type,
        org: org,
        name: name,
      },
      body: body,
      errors: {
        400: `Unable to create the secret`,
        500: `Unable to create the secret`,
      },
    });
  }

  /**
   * Retrieve a secret from the configured backend
   * @param engine Secret engine to create a secret in, eg. "native"
   * @param type Secret type to create
   * @param org Name of the org
   * @param name Name of the repo if a repo secret, team name if a shared secret, or '*' if an org secret
   * @param secret Name of the secret
   * @returns Secret Successfully retrieved the secret
   * @throws ApiError
   */
  public static getSecret(
    engine: string,
    type: "org" | "repo" | "shared",
    org: string,
    name: string,
    secret: string
  ): CancelablePromise<Secret> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/secrets/{engine}/{type}/{org}/{name}/{secret}",
      path: {
        engine: engine,
        type: type,
        org: org,
        name: name,
        secret: secret,
      },
      errors: {
        500: `Unable to retrieve the secret`,
      },
    });
  }

  /**
   * Update a secret on the configured backend
   * @param engine Secret engine to update the secret in, eg. "native"
   * @param type Secret type to update
   * @param org Name of the org
   * @param name Name of the repo if a repo secret, team name if a shared secret, or '*' if an org secret
   * @param secret Name of the secret
   * @param body Payload containing the secret to create
   * @returns Secret Successfully updated the secret
   * @throws ApiError
   */
  public static updateSecrets(
    engine: string,
    type: "org" | "repo" | "shared",
    org: string,
    name: string,
    secret: string,
    body: Secret
  ): CancelablePromise<Secret> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/secrets/{engine}/{type}/{org}/{name}/{secret}",
      path: {
        engine: engine,
        type: type,
        org: org,
        name: name,
        secret: secret,
      },
      body: body,
      errors: {
        400: `Unable to update the secret`,
        500: `Unable to update the secret`,
      },
    });
  }

  /**
   * Delete a secret from the configured backend
   * @param engine Secret engine to delete the secret from, eg. "native"
   * @param type Secret type to delete
   * @param org Name of the org
   * @param name Name of the repo if a repo secret, team name if a shared secret, or '*' if an org secret
   * @param secret Name of the secret
   * @returns string Successfully deleted the secret
   * @throws ApiError
   */
  public static deleteSecret(
    engine: string,
    type: "org" | "repo" | "shared",
    org: string,
    name: string,
    secret: string
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/secrets/{engine}/{type}/{org}/{name}/{secret}",
      path: {
        engine: engine,
        type: type,
        org: org,
        name: name,
        secret: secret,
      },
      errors: {
        500: `Unable to delete the secret`,
      },
    });
  }
}
