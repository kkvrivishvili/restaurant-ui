import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar variant="client" />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
