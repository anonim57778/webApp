import * as React from "react";

import { cn } from "~/lib/client/utils";
import CopyButton from "../copy_button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 border-2 border-white w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface CopyInputProps extends InputProps {
  parentClassName?: string;
  value: string;
}

const CopyInput = React.forwardRef<HTMLInputElement, CopyInputProps>(
  ({ className, parentClassName, ...props }, ref) => {
    return (
      <div className={cn("relative h-fit", parentClassName)}>
        <Input
          className={cn(className, "mr-8")}
          ref={ref}
          disabled={true}
          {...props}
        />
        <CopyButton
          value={props.value}
          className="absolute right-0 inset-y-0"
        />
      </div>
    );
  },
);
CopyInput.displayName = "CopyInput";

export { Input, CopyInput };
