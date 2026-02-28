import { useState, useMemo } from "react";
import type { TemplateInfo } from "../types";
import { SearchToolbar } from "../components/SeachToolbar/SearchToolbar";

interface TemplateSelectorProps {
  templates: TemplateInfo[];
  selectedTemplate: TemplateInfo | null;
  onSelect: (template: TemplateInfo) => void;
  onUpload: (template: TemplateInfo) => void;
  onDelete: (templateId: string) => void;
  onClose: () => void;
}

export const TemplateSelector = ({
  templates,
  selectedTemplate,
  onSelect,
  onUpload,
  onDelete,
  onClose,
}: TemplateSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [templates, searchQuery]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny (PNG, JPG, SVG)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const customTemplate: TemplateInfo = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        thumbnail: dataUrl,
        path: dataUrl,
        description: "Własny szablon",
        category: "custom",
        isCustom: true,
      };

      onUpload(customTemplate);
    };
    reader.readAsDataURL(file);
  };

  const handleSelect = (template: TemplateInfo) => {
    if (selectedTemplate?.id === template.id) {
      onSelect(null as any);
      onClose();
    } else {
      onSelect(template);
      onClose();
    }
  };

  const handleDeleteCustomTemplate = (
    e: React.MouseEvent,
    templateToDelete: TemplateInfo,
  ) => {
    e.stopPropagation();
    onDelete(templateToDelete.id);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 text-blue-700";
      case "education":
        return "bg-green-100 text-green-700";
      case "sport":
        return "bg-orange-100 text-orange-700";
      case "custom":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[80] p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col ring-1 ring-black/5 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 flex items-center justify-between bg-white z-10 border-b border-gray-50">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Wybierz Szablon
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {templates.length} dostępnych szablonów
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedTemplate && (
              <button
                onClick={() => {
                  onSelect(null as any);
                  onClose();
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
                Odznacz
              </button>
            )}

            <label className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
              </svg>
              <span>Wczytaj własny</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 pt-6 pb-2 bg-gray-50/50">
          <SearchToolbar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Szukaj szablonu..."
          />
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2 bg-gray-50/50 flex flex-col">
          {filteredTemplates.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[300px]">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Brak wyników
              </h2>
              <p className="text-gray-500 max-w-sm mb-8">
                Brak dostępnych szablonów do wyboru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all ${selectedTemplate?.id === template.id
                    ? "border-indigo-500 ring-4 ring-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-indigo-300"
                    }`}
                >
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Wybrany
                    </div>
                  )}

                  {template.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomTemplate(e, template)}
                      className="absolute top-3 left-3 z-10 bg-white text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm border border-gray-100"
                      title="Usuń szablon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}

                  <div className="aspect-[4/3] bg-gray-100/50 overflow-hidden relative border-b border-gray-50">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-contain p-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.innerHTML += `
                            <div class="flex items-center justify-center h-full">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-gray-300">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>

                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                        {template.name}
                      </h3>
                      {template.category && (
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(
                            template.category,
                          )}`}
                        >
                          {template.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1 truncate">
                      {template.description}
                    </p>
                    {template.isCustom && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600 font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Własny szablon
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-gray-50 bg-white flex items-center justify-between z-10">
          <div className="text-sm text-gray-500">
            {selectedTemplate ? (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Wybrano:{" "}
                <strong className="text-gray-900">
                  {selectedTemplate.name}
                </strong>
              </span>
            ) : (
              "Wybierz szablon aby kontynuować"
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
