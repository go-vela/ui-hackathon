import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { Input } from "./formInputs/Input";
import { TextArea } from "./formInputs/TextArea";
import { LabelDetail } from "./formInputs/LabelDetail";
import { Checkbox } from "./formInputs/Checkbox";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { SecretsService } from "../api";
import { IconGear } from "./IconGear";
import { SecretPost } from "../api/models/Secret";

export interface RepoSecretsAddWidgetProps {
  org: string;
  repo: string;
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

function AllowList() {
  const [inputValue, setInputValue] = useState<string>("");
  const [allowedImages, setAllowedImages] = useState<Array<string>>([]);

  const appendAllowedImage = () => {
    setAllowedImages((imgs) => {
      if (inputValue !== "") {
        const imgSet = new Set(imgs);
        imgSet.add(inputValue);
        return [...imgSet.values()];
      }
      return imgs;
    });
    setInputValue("");
  };

  return (
    <>
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Image Name"
        label="Limit to Docker Images"
        labelDetail={
          <LabelDetail>
            (Leave blank to enable this secret for all images)
          </LabelDetail>
        }
      />
      <button onClick={appendAllowedImage}>Add Image</button>
      {allowedImages.length === 0 ? (
        <div className="font-mono bg-vela-coal-dark text-sm p-2">
          enabled for all images
        </div>
      ) : null}
      {allowedImages.length !== 0 ? JSON.stringify(allowedImages) : null}
    </>
  );
}

export function RepoSecretsAddWidget({ org, repo }: RepoSecretsAddWidgetProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "_allowedImages", // unique name for your Field Array
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    // todo: data massaging
    console.log("repo secrets add widget payload", JSON.stringify(data));

    const createSecretBody: SecretPost = {
      org,
      repo,
      type: "repo",
      team: null,
      events: data.events,
      allow_command: data.allowCommands,
      name: data.secretName,
      value: data.secretValue,
      images: data.__allowedImages,
    };
    // todo: trigger react query mutation with Velakit
    SecretsService.createSecret("native", "repo", org, repo, createSecretBody);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="border-b-2 border-b-vela-lavender text-2xl font-bold">
          Add Repo Secret
        </h2>
        <div className="mb-4 mt-4 flex items-center justify-between max-w-3xl">
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col w-full gap-4">
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
              <div className="p-4 bg-vela-coal-light text-white text-sm">
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
                    <button
                      className="block w-6 h-6"
                      onClick={() => append("")}
                    >
                      <IconGear />
                    </button>
                  </div>
                </div>

                {fields.length === 0 ? (
                  <div className="font-mono bg-vela-coal-dark text-sm p-2 mr-4 ml-4">
                    enabled for all images
                  </div>
                ) : null}
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-center pl-4">
                    <Input
                      label="Image Name"
                      {...register(`_allowedImages.${index}`)}
                    />

                    <div>
                      <button onClick={() => remove(index)}>x</button>
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
                  defaultValue="default"
                  aria-label="Allow commands"
                >
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-vela-coal-dark border-2 border-vela-cyan rounded-full w-[25px] h-[25px]"
                      value="true"
                      id="r1"
                      {...register("allowCommands")}
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-vela-cyan" />
                    </RadioGroup.Item>
                    <label
                      className="text-white text-[15px] leading-none pl-[15px]"
                      htmlFor="r1"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item
                      className="bg-vela-coal-dark border-2 border-vela-cyan rounded-full w-[25px] h-[25px]"
                      value="false"
                      id="r2"
                      {...register("allowCommands")}
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-vela-cyan" />
                    </RadioGroup.Item>
                    <label
                      className="text-white text-[15px] leading-none pl-[15px]"
                      htmlFor="r2"
                    >
                      No
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>
              <div className="text-sm">Need help? Visit our docs!</div>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
