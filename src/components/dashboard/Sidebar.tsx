"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardConfig } from "@/config/dashboard";

interface SidebarProps {
  variant: "admin" | "client";
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const config = dashboardConfig[variant];

  return (
    <div className="flex h-screen w-72 flex-col border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{config.title}</h2>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {config.items.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
