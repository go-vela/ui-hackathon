import React, { ReactNode } from "react";

import * as Label from "@radix-ui/react-label";

type InputProps = {
  label: string;
  labelDetail?: ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelDetail, ...inputProps }: InputProps, ref) => {
    const id = label.replace(/[^a-zA-Z0-9]/gi, "_") + "_input";
    return (
      <>
        <Label.Root className="" htmlFor={id}>
          {label} {labelDetail}
        </Label.Root>
        <input
          {...inputProps}
          ref={ref}
          className="border-b-2 border-l-0 border-r-0 border-t-0 border-b-vela-cyan bg-transparent"
          id={id}
        />
      </>
    );
  }
);
