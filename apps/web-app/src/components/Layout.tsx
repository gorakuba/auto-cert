import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    participants: number;
    templates: number;
    projects: number;
  };
}

export const Layout = ({
  children,
  activeTab,
  onTabChange,
  counts,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 p-8 overflow-y-auto h-screen w-full">
        {children}
      </div>
    </div>
  );
};
