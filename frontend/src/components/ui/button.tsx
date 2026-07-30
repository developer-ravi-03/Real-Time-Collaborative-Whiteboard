import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",

        brand:
          "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 hover:shadow-md",

        outline:
          "border border-border/70 bg-background/70 backdrop-blur-md shadow-sm hover:border-primary/30 hover:bg-muted/60 hover:shadow-md",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost: "hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        xs: "h-7 rounded-md px-2 text-xs",

        sm: "h-9 rounded-lg px-3",

        default: "h-10 rounded-lg px-4 py-2",

        lg: "h-11 rounded-xl px-6",

        icon: "h-10 w-10 rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
