import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar variant="admin" />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
