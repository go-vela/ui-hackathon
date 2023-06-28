import React from "react";

import * as Label from "@radix-ui/react-label";

type TextArea = {
  label: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextArea>(
  ({ label, ...inputProps }: TextArea, ref) => {
    const id = label.replace(/[^a-zA-Z0-9]/gi, "_") + "_textarea";
    return (
      <>
        <Label.Root className="" htmlFor={id}>
          {label}
        </Label.Root>
        <textarea
          {...inputProps}
          ref={ref}
          className="border-0 bg-vela-coal-dark font-mono"
          id={id}
        />
      </>
    );
  }
);
