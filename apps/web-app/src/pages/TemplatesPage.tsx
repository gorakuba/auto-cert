import { useState } from "react";
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
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "custom" | "default">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
    templateName: string;
  }>({
    isOpen: false,
    templateId: null,
    templateName: "",
  });

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "custom" && t.isCustom) ||
      (typeFilter === "default" && !t.isCustom);
    return matchesSearch && matchesType;
  });

  const FILTERS: { key: typeof typeFilter; label: string }[] = [
    { key: "all", label: "Wszystkie" },
    { key: "default", label: "Domyślne" },
    { key: "custom", label: "Własne" },
  ];

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

  const isEmpty = templates.length === 0;

  return (
    <div className="w-full animate-in fade-in duration-300 flex flex-col min-h-full">
      {/* Header */}
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

      {/* Search toolbar + filters */}
      <SearchToolbar
        value={search}
        onChange={setSearch}
        placeholder="Szukaj szablonu..."
        disabled={isEmpty}
      />

      {/* Filter chips */}
      {!isEmpty && (
        <div className="flex items-center gap-2 mb-6 -mt-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${typeFilter === f.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">
            {filteredTemplates.length} z {templates.length}
          </span>
        </div>
      )}

      {/* Empty state — no templates at all */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-20 h-20 mx-auto mb-5 text-gray-200"
          >
            <path
              fillRule="evenodd"
              d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
              clipRule="evenodd"
            />
            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Brak szablonów certyfikatów
          </h3>
          <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
            Wczytaj własny szablon graficzny, aby rozpocząć generowanie certyfikatów.
          </p>
        </div>
      )}

      {/* Templates grid */}
      {!isEmpty && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className={`group relative border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selectedTemplate?.id === template.id
                  ? "bg-indigo-50/30 border-indigo-600 border-2 ring-4 ring-indigo-50 shadow-lg"
                  : "bg-white border-gray-200 hover:border-indigo-300"
                  }`}
              >
                {/* Selected Badge */}
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

                {/* Delete Button for Custom Templates */}
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
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
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

          {/* No search results */}
          {filteredTemplates.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-14 h-14 mx-auto mb-4 text-gray-200"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Nie znaleziono szablonów pasujących do „{search}"
              </p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
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
