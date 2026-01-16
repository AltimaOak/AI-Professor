import React, { forwardRef, useContext } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "../lib/utils"; // adjust path if needed
import { toggleVariants } from "../components/ui/toggle"; // adjust path if needed

// Context to share variant and size across ToggleGroup items
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

const ToggleGroup = forwardRef(
  ({ className, variant, size, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = forwardRef(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = useContext(ToggleGroupContext);

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
