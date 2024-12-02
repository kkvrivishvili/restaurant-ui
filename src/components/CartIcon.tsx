'use client';

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  className?: string;
  iconClassName?: string;
}

const CartIcon = ({
  className,
  iconClassName
}: CartIconProps) => {
  const { totalItems } = useCart();
  
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative">
        <ShoppingCart 
          className={cn(
            "h-6 w-6 text-foreground transition-colors hover:text-muted-foreground",
            iconClassName
          )} 
        />
        {totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-medium"
          >
            {totalItems}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
