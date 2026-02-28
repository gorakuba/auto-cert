import { useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Modal } from "../components/Modal/Modal";
import { SearchToolbar } from "../components/SeachToolbar/SearchToolbar";
import type { TemplateInfo } from "../types";

interface TemplatesPageProps {
  templates: TemplateInfo[];
  selectedTemplate: TemplateInfo | null;
  onSelect: (template: TemplateInfo) => void;
  onUpload?: (template: TemplateInfo) => void;
  onDelete?: (templateId: string) => void;
}

export const TemplatesPage = ({
  templates,
  selectedTemplate,
  onSelect,
  onUpload,
  onDelete,
}: TemplatesPageProps) => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
    templateName: string;
  }>({
    isOpen: false,
    templateId: null,
    templateName: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Wszystkie szablony" },
    { id: "built-in", label: "Wbudowane" },
    { id: "custom", label: "Własne" },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "built-in") return !template.isCustom;
      if (activeFilter === "custom") return template.isCustom;

      return true;
    });
  }, [templates, searchQuery, activeFilter]);

  const handleDeleteClick = (e: React.MouseEvent, template: TemplateInfo) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      templateId: template.id,
      templateName: template.name,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.templateId && onDelete) {
      onDelete(deleteModal.templateId);
    }
    setDeleteModal({ isOpen: false, templateId: null, templateName: "" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;

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

  return (
    <div className="flex flex-col min-h-full w-full animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Szablony Certyfikatów
          </h1>
          <p className="text-gray-500 mt-1">
            Wybierz styl certyfikatu dla swojego projektu.
          </p>
        </div>
        {onUpload && (
          <label className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
            </svg>
            Wczytaj własny
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <SearchToolbar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Szukaj szablonu..."
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 overflow-y-auto items-start">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template)}
              className={`group relative border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedTemplate?.id === template.id
                ? "bg-indigo-50/30 border-indigo-600 border-2 ring-4 ring-indigo-50 shadow-lg"
                : "bg-white border-gray-200 hover:border-indigo-300"
                }`}
            >
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-0 right-0 z-20">
                  <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-bl-xl font-semibold text-xs shadow-sm flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Wybrany
                  </div>
                </div>
              )}

              {template.isCustom && (
                <button
                  onClick={(e) => handleDeleteClick(e, template)}
                  className="absolute top-3 left-3 p-2 bg-white/90 text-gray-500 hover:text-red-600 hover:bg-white rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10 border border-gray-100"
                  title="Usuń szablon"
                >
                  <FaTrash />
                </button>
              )}

              <div className="aspect-[4/3] bg-gray-100/50 overflow-hidden relative border-b border-gray-50">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1 truncate">
                  {template.description}
                </p>
                {template.isCustom && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 font-medium">
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Brak wyników</h2>
          <p className="text-gray-500 max-w-sm mb-8">
            Nie znaleziono szablonów spełniających podane kryteria wyszukiwania
            i filtrów.
          </p>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, templateId: null, templateName: "" })
        }
        title="Usuń szablon"
        message={`Czy na pewno chcesz usunąć szablon "${deleteModal.templateName}"?\nTej operacji nie można cofnąć.`}
        type="warning"
        confirmText="Usuń"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
      />
    </div>
  );
};
