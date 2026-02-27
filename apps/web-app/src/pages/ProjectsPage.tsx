import { useState, useMemo } from "react";
import type { RecentProject } from "../types";
import { SearchToolbar } from "../components/SeachToolbar/SearchToolbar";

interface ProjectsPageProps {
  projects: RecentProject[];
  onOpenProject: (project: RecentProject) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectsPage = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onNewProject,
}: ProjectsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most">("newest");

  const SORT_OPTIONS: { key: typeof sortBy; label: string }[] = [
    { key: "newest", label: "Najnowsze" },
    { key: "oldest", label: "Najstarsze" },
    { key: "most", label: "Najwięcej uczestników" },
  ];

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) =>
      project.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") return b.lastEdited - a.lastEdited;
      if (sortBy === "oldest") return a.lastEdited - b.lastEdited;
      return b.participantsCount - a.participantsCount;
    });
  }, [projects, searchQuery, sortBy]);

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Twoje Projekty</h1>
          <p className="text-gray-500 mt-1">
            Zarządzaj swoimi zapisanymi sesjami generowania certyfikatów.
          </p>
        </div>
        <button
          onClick={onNewProject}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Nowy Projekt
        </button>
      </header>

      {/* Search & Filter Bar */}
      <SearchToolbar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Szukaj projektu..."
        disabled={projects.length === 0}
      />

      {/* Sort chips */}
      {projects.length > 0 && (
        <div className="flex items-center gap-2 mb-5 -mt-2 flex-wrap">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${sortBy === s.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              {s.label}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">
            {filteredProjects.length} z {projects.length}
          </span>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                {project.templateThumbnail ? (
                  <img
                    src={project.templateThumbnail}
                    alt={project.templateName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="font-bold text-gray-900 truncate pr-2"
                    title={project.templateName}
                  >
                    {project.templateName}
                  </h3>
                </div>

                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.532-2.407.75.75 0 0 1-1.359.63A4.502 4.502 0 0 0 3.75 14.5a3.75 3.75 0 0 0-2.135.65.236.236 0 0 0 .142.406 2.08 2.08 0 0 0 1.956-1.168.75.75 0 1 1 1.354.636 3.58 3.58 0 0 1-3.452 1.404Z" />
                    </svg>
                    <span>{project.participantsCount} uczestników</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75l4 4a.75.75 0 1 0 1.06-1.06l-3.81-3.81V5Z"
                        clipRule="evenodd"
                      />
                    </svg>
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

                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => onOpenProject(project)}
                    className="flex-1 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                  >
                    Otwórz
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Usuń projekt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.49 1.478l-.175-.058a9.1 9.1 0 0 1-1.767 5.86h-2.418a9.1 9.1 0 0 1-1.802-5.875l-.173.061a.75.75 0 1 1-.497-1.48 48.824 48.824 0 0 1 3.444-.516V4.478A2.25 2.25 0 0 1 12 2.25h1.5a2.25 2.25 0 0 1 2.25 2.228ZM4.5 6a.75.75 0 0 0-.75.75v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V6.75a.75.75 0 0 0-.75-.75h-15Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[400px]">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? "Brak wyników wyszukiwania"
              : "Brak zapisanych projektów"}
          </h2>
          <p className="text-gray-500 max-w-sm mb-8">
            {searchQuery
              ? "Spróbuj zmienić zapytanie."
              : "Rozpocznij pracę nad nowym certyfikatem, a Twoje postępy zostaną tutaj zapisane."}
          </p>
        </div>
      )}
    </div>
  );
};
