import { useMemo } from "react";
import type { Participant, TemplateInfo } from "../types";

interface DashboardProps {
  participants: Participant[];
  templates: TemplateInfo[];
  generatedCount: number;
  onQuickAction: (action: string) => void;
  selectedTemplate?: TemplateInfo | null;
  recentProjects?: import("../types").RecentProject[];
  onOpenProject?: (project: import("../types").RecentProject) => void;
  onNewProject?: () => void;
}

export const Dashboard = ({
  participants,
  templates,
  generatedCount,
  recentProjects,
  onOpenProject,
  onNewProject,
}: DashboardProps) => {
  const recentActivity = useMemo(() => {
    const activities: Array<{
      text: string;
      time: string;
      icon: React.ReactNode;
      color: string;
    }> = [];

    if (participants.length > 0) {
      activities.push({
        text: `Zaimportowano ${participants.length} uczestników`,
        time: "Dzisiaj",
        icon: (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        ),
        color: "text-gray-900",
      });
    }

    if (generatedCount > 0) {
      activities.push({
        text: `Wygenerowano ${generatedCount} certyfikatów`,
        time: "Dzisiaj",
        icon: (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        ),
        color: "text-gray-900",
      });
    }

    if (activities.length === 0) {
      activities.push({
        text: "Witaj w nowym dashboardzie!",
        time: "Teraz",
        icon: (
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
        ),
        color: "text-gray-900",
      });
    }

    return activities;
  }, [participants, generatedCount]);

  return (
    <div className="w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Witaj! 👋</h1>
          <p className="text-gray-500 mt-1">
            Oto co dzieje się dzisiaj w Twoich certyfikatach.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-4.42 6.753 6.753 0 0 1-4.825 3.316Z" />
              </svg>
            </div>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Uczestnicy</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {participants.length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 1.5h-3c.22.015.44.032.66.05H12c.22-.018.44-.035.66-.05Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M15 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-6 6m6-6v9a6 6 0 0 1-6-6m0 0a6 6 0 0 1-6 6m6-6v9a6 6 0 0 1-6-6m0 0a6 6 0 0 1-6 6m6-6c0 3.314-2.686 6-6 6"
                  clipRule="evenodd"
                />
                <path d="M12 5.25a3 3 0 0 1 3 3v9.375a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3.375 3.375 0 0 1 3.375-3.375H12Z" />
              </svg>
            </div>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              Ogółem
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Wygenerowano</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {generatedCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              Dostępne
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Szablony</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {templates.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-col xl:flex-row">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Ostatnio Edytowane
            </h2>

            {recentProjects && recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onOpenProject && onOpenProject(project)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                      {project.templateThumbnail ? (
                        <img
                          src={project.templateThumbnail}
                          alt={project.templateName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-gray-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {project.templateName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.532-2.407.75.75 0 0 1-1.359.63A4.502 4.502 0 0 0 3.75 14.5a3.75 3.75 0 0 0-2.135.65.236.236 0 0 0 .142.406 2.08 2.08 0 0 0 1.956-1.168.75.75 0 1 1 1.354.636 3.58 3.58 0 0 1-3.452 1.404Z" />
                          </svg>
                          {project.participantsCount} os.
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(project.lastEdited).toLocaleDateString(
                            "pl-PL",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Brak ostatnich projektów
                </h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">
                  Rozpocznij pracę wybierając nowy projekt, a Twoja historia
                  pojawi się tutaj.
                </p>
                <button
                  onClick={onNewProject}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-bold"
                >
                  Rozpocznij Projekt
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full xl:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Ostatnia Aktywność
            </h3>

            <div className="space-y-6">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
