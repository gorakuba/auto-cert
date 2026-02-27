import type { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
}

const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  badge,
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <div
        className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge ? (
        <span
          className={`ml-auto text-xs py-0.5 px-2 rounded-full ${
            isActive
              ? "bg-white/20 text-white"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    participants: number;
    templates: number;
    projects: number;
  };
}

export const Sidebar = ({ activeTab, onTabChange, counts }: SidebarProps) => {
  return (
    <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 p-6 flex flex-col z-20 hidden lg:flex">
      {/* Logo */}
      <div className="px-2 mb-10">
        <img
          src="/logo.svg"
          alt="Auto-Cert"
          className="h-16 w-auto"
          draggable={false}
        />
      </div>

      {/* Menu */}
      <div className="space-y-2 flex-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
          Menu
        </div>

        <SidebarItem
          label="Dashboard"
          isActive={activeTab === "dashboard"}
          onClick={() => onTabChange("dashboard")}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <SidebarItem
          label="Projekty"
          isActive={activeTab === "projects"}
          onClick={() => onTabChange("projects")}
          badge={
            counts?.projects && counts.projects > 0
              ? counts.projects
              : undefined
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H20.25A2.25 2.25 0 0 1 22.5 11.25v9.75a2.25 2.25 0 0 1-2.25 2.25H2.25A2.25 2.25 0 0 1 0 21V4.5A2.25 2.25 0 0 1 2.25 2.25h1.5a2.25 2.25 0 0 1 2.25-.375ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z"
                clipRule="evenodd"
              />
              <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
            </svg>
          }
        />

        <SidebarItem
          label="Uczestnicy"
          isActive={activeTab === "participants"}
          onClick={() => onTabChange("participants")}
          badge={
            counts?.participants && counts.participants > 0
              ? counts.participants
              : undefined
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-4.42 6.753 6.753 0 0 1-4.825 3.316Z" />
            </svg>
          }
        />

        <SidebarItem
          label="Szablony"
          isActive={activeTab === "templates"}
          onClick={() => onTabChange("templates")}
          badge={
            counts?.templates && counts.templates > 0
              ? counts.templates
              : undefined
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <SidebarItem
          label="Generator"
          isActive={activeTab === "generator"}
          onClick={() => onTabChange("generator")}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
              />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};
