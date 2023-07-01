import * as RadioGroup from "@radix-ui/react-radio-group";

import { Input } from "./formInputs/Input.tsx";
import { TextArea } from "./formInputs/TextArea.tsx";
import { LabelDetail } from "./formInputs/LabelDetail.tsx";
import { Checkbox } from "./formInputs/Checkbox.tsx";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { SecretsService } from "../api/index.ts";
import { SecretCorrected, SecretPost } from "../api/models/Secret.ts";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "./Loader.tsx";
import { Link } from "react-router-dom";
import { IconPlus } from "./icons/IconPlus.tsx";
import { useToast } from "./toast/useToast.tsx";

export interface RepoSecretsFormWidgetProps {
  org: string;
  repo: string;
  secretName?: string;
  mode: "edit" | "add" | "view";
}

function Spacer() {
  return <div className="mb-2" />;
}

function Reverse({ children }: any) {
  return (
    <div className="flex flex-row-reverse items-center gap-4 [justify-content:start]">
      {children}
    </div>
  );
}

function SaveButton({ isLoading }: any) {
  if (isLoading) {
    return (
      <div className="btn-primary flex justify-center align-middle opacity-30">
        <Loader />
      </div>
    );
  }
  return <input type="submit" className="btn-primary" value="Save" />;
}

export function RepoSecretsFormWidget({
  org,
  repo,
  secretName,
  mode,
}: RepoSecretsFormWidgetProps) {
  const { register, handleSubmit, control } = useForm<any>({
    defaultValues: async () => {
      if (mode === "add") {
        return {};
      }
      const resp = (await SecretsService.getSecret(
        "native",
        "repo",
        org!,
        repo,
        secretName!
      )) as unknown as SecretCorrected;

      return {
        secretName: resp.name,
        events: resp.events,
        allowCommands: JSON.stringify(resp.allow_command),
        allowedImages: resp.images,
      };
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "allowedImages", // unique name for your Field Array
  });

  const SuccessToast = useToast();
  const FailedToast = useToast();

  const addSecretMutation = useMutation({
    mutationFn: (data: any) => {
      console.log("repo secrets add widget payload", JSON.stringify(data));

      const createSecretBody: SecretPost = {
        org,
        repo,
        type: "repo",
        team: null,
        events: data.events,
        allow_command: data.allowCommands === "true",
        name: data.secretName,
        value:
          mode === "add" || data.secretValue !== "" ? data.secretValue : null,
        images: data.allowedImages,
      };

      if (mode === "add") {
        return SecretsService.createSecret(
          "native",
          "repo",
          org,
          repo,
          createSecretBody
        );
      }

      return SecretsService.updateSecrets(
        "native",
        "repo",
        org,
        repo,
        secretName as string,
        createSecretBody as any
      );
    },
    onError(error: any) {
      console.log({ error });
      FailedToast.publish();
    },
    onSuccess() {
      SuccessToast.publish();
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    addSecretMutation.mutate(data);
  };

  const { isLoading, isSuccess, failureReason } = addSecretMutation;

  const failureString =
    ((failureReason && typeof failureReason?.body) === "string"
      ? JSON.parse(failureReason?.body)?.error
      : failureReason?.body?.error) ?? "Unknown Error";

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="border-b-2 border-b-vela-lavender text-2xl font-bold">
          Add Repo Secret
        </h2>
        <div className="mb-4 mt-4 flex max-w-3xl items-center justify-between">
          <div className="flex w-full items-center gap-4">
            <div className="flex w-full flex-col gap-4">
              <Input
                placeholder="Secret Name"
                label="Name"
                {...register("secretName")}
              />
              <Spacer />
              <TextArea label="Value" {...register("secretValue")} />
              <Spacer />
              <div>
                Limit to Events{" "}
                <LabelDetail>(at least one event must be selected)</LabelDetail>
              </div>
              <div className="bg-vela-coal-light p-4 text-sm text-white">
                Disclaimer: Native secrets do NOT have the pull_request event
                enabled by default. This is intentional to help mitigate
                exposure via a pull request against the repo. You can override
                this behavior, at your own risk, for each secret.
              </div>
              <Reverse>
                <Checkbox label="Push" {...register("events[]")} value="push" />
              </Reverse>
              <Reverse>
                <Checkbox
                  label="Pull Request"
                  {...register("events[]")}
                  value="pull_request"
                />
              </Reverse>
              <Reverse>
                <Checkbox label="Tag" {...register("events[]")} value="tag" />
              </Reverse>
              <Reverse>
                <Checkbox
                  label="Comment"
                  {...register("events[]")}
                  value="comment"
                />
              </Reverse>
              <Reverse>
                <Checkbox
                  label="Deployment"
                  {...register("events[]")}
                  value="deployment"
                />
              </Reverse>
              <div>
                <div className="flex items-center gap-4">
                  <h2>Allowed Images</h2>
                  <div className="mb-4">
                    <div className="block h-6 w-6" onClick={() => append("")}>
                      <IconPlus />
                    </div>
                  </div>
                </div>

                {fields.length === 0 ? (
                  <div className="ml-4 mr-4 bg-vela-coal-dark p-2 font-mono text-sm">
                    enabled for all images
                  </div>
                ) : null}
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4 pl-4">
                    <Input
                      label="Image Name"
                      {...register(`allowedImages.${index}`)}
                    />

                    <div>
                      <button type="button" onClick={() => remove(index)}>
                        x
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                Allow Commands{" "}
                <LabelDetail>
                  ("No" will disable this secret in commands)
                </LabelDetail>
              </div>

              <div>
                <RadioGroup.Root
                  id="allow_commands"
                  className="flex flex-col gap-2.5"
                  defaultValue="true"
                  aria-label="Allow commands"
                >
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="h-[25px] w-[25px] rounded-full border-2 border-vela-cyan bg-vela-coal-dark"
                      value="true"
                      id="r1"
                      {...register("allowCommands")}
                    >
                      <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:bg-vela-cyan after:content-['']" />
                    </RadioGroup.Item>
                    <label
                      className="pl-[15px] text-[15px] leading-none text-white"
                      htmlFor="r1"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="h-[25px] w-[25px] rounded-full border-2 border-vela-cyan bg-vela-coal-dark"
                      value="false"
                      id="r2"
                      {...register("allowCommands")}
                    >
                      <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:bg-vela-cyan after:content-['']" />
                    </RadioGroup.Item>
                    <label
                      className="pl-[15px] text-[15px] leading-none text-white"
                      htmlFor="r2"
                    >
                      No
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>
              <div className="text-sm">Need help? Visit our docs!</div>
              {isSuccess ? (
                <Link
                  className="btn-primary"
                  to={`/${org}/${repo}/$/secrets/native}`}
                >
                  ← Back to Secrets
                </Link>
              ) : (
                <SaveButton isLoading={isLoading} />
              )}
              <SuccessToast.Component type="success" title="Success">
                Successfully saved your secret
              </SuccessToast.Component>
              <FailedToast.Component type="error" title="Error">
                {failureString}
              </FailedToast.Component>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}