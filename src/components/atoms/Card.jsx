import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;