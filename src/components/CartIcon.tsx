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

export default function CartIcon({ className, iconClassName }: CartIconProps) {
  const { totalItems } = useCart();
  
  return (
    <div className={cn("relative inline-block", className)}>
      <ShoppingCart 
        className={cn(
          "h-6 w-6 text-foreground transition-colors hover:text-muted-foreground",
          iconClassName
        )} 
      />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {totalItems}
        </Badge>
      )}
    </div>
  );
}
