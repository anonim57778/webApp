import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/client/utils";
import Loader from "./loader";

const buttonVariants = cva(
  "inline-flex gap-2.5 items-center justify-center whitespace-nowrap rounded-[15px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-black font-semibold text-base hover:bg-primary/90",
        command: "bg-secondary hover:bg-secondary/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "text-white border border-white/50 hover:border-white/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-[#F1B432] to-[#F2D739] text-base font-semibold w-full text-white hover:opacity-90",
        transparent: "p-0",
      },
      size: {
        default: "px-4 py-[14px]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        none: "p-0 size-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  chevron?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      chevron,
      disabled,
      loading,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          chevron && "justify-between",
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader size="sm" /> : props.children}
        {chevron && <ChevronDown />}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
