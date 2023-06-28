import React, { ReactNode } from "react";

import * as Label from "@radix-ui/react-label";

type CheckboxProps = {
  label: string;
  labelDetail?: ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, labelDetail, ...inputProps }: CheckboxProps, ref) => {
    const id = label.replace(/[^a-zA-Z0-9]/gi, "_") + "_checkbox";
    return (
      <>
        <Label.Root className="" htmlFor={id}>
          {label}
          {labelDetail}
        </Label.Root>
        <input
          {...inputProps}
          ref={ref}
          type="checkbox"
          className=" bg-vela-cyan checked:bg-vela-cyan hover:bg-vela-cyan focus:bg-vela-cyan focus:text-vela-cyan focus-within:text-vela-cyan"
          id={id}
        />
      </>
    );
  }
);
