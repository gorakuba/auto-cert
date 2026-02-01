import { useEffect, useState } from "react";

interface TemplateInfo {
  id: string;
  name: string;
  thumbnail: string;
  path: string;
  description: string;
  category?: "business" | "education" | "sport" | "custom" | "other";
  isCustom?: boolean;
}

interface TemplateSelectorProps {
  templates: TemplateInfo[];
  selectedTemplate: TemplateInfo | null;
  onSelect: (template: TemplateInfo) => void;
  onClose: () => void;
}

export const TemplateSelector = ({

  selectedTemplate,
  onSelect,
  onClose,
}: TemplateSelectorProps) => {
  const [availableTemplates, setAvailableTemplates] = useState<TemplateInfo[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Sprawdź czy to plik graficzny
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

      // Zapisz do localStorage
      const customTemplatesStr = localStorage.getItem(
        "auto-cert-custom-templates",
      );
      let customTemplates: TemplateInfo[] = [];
      if (customTemplatesStr) {
        try {
          customTemplates = JSON.parse(customTemplatesStr);
        } catch (e) {
          console.error("Failed to parse custom templates:", e);
        }
      }
      customTemplates.push(customTemplate);
      localStorage.setItem(
        "auto-cert-custom-templates",
        JSON.stringify(customTemplates),
      );

      // Dodaj do dostępnych szablonów
      setAvailableTemplates((prev) => [customTemplate, ...prev]);

      // Automatycznie wybierz nowy szablon
      handleSelect(customTemplate);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Load templates from public folder
    const defaultTemplates: TemplateInfo[] = [
      {
        id: "t1",
        name: "Szablon Klasyczny",
        thumbnail: "/templates/template1.svg",
        path: "/templates/template1.svg",
        description: "Elegancki klasyczny certyfikat",
        category: "education",
        isCustom: false,
      },
      {
        id: "t2",
        name: "Szablon Nowoczesny",
        thumbnail: "/templates/template2.svg",
        path: "/templates/template2.svg",
        description: "Nowoczesny design z geometrycznymi elementami",
        category: "business",
        isCustom: false,
      },
      {
        id: "t3",
        name: "Szablon Minimalistyczny",
        thumbnail: "/templates/template3.svg",
        path: "/templates/template3.svg",
        description: "Prosty i elegancki minimalizm",
        category: "other",
        isCustom: false,
      },
    ];

    // Load custom templates from localStorage
    const customTemplatesStr = localStorage.getItem(
      "auto-cert-custom-templates",
    );
    let customTemplates: TemplateInfo[] = [];
    if (customTemplatesStr) {
      try {
        customTemplates = JSON.parse(customTemplatesStr);
      } catch (e) {
        console.error("Failed to parse custom templates:", e);
      }
    }

    setAvailableTemplates([...defaultTemplates, ...customTemplates]);
    setLoading(false);
  }, []);

  const handleSelect = (template: TemplateInfo) => {
    // Jeśli klikamy na już wybrany szablon, odznacz go
    if (selectedTemplate?.id === template.id) {
      onSelect(null as any); // Odznaczenie szablonu
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
    e.stopPropagation(); // Zapobiega kliknięciu na kartę

    // Usuń z localStorage
    try {
      const customTemplatesStr = localStorage.getItem(
        "auto-cert-custom-templates",
      );
      if (customTemplatesStr) {
        const customTemplates: TemplateInfo[] = JSON.parse(customTemplatesStr);
        const updatedCustomTemplates = customTemplates.filter(
          (t) => t.id !== templateToDelete.id,
        );
        localStorage.setItem(
          "auto-cert-custom-templates",
          JSON.stringify(updatedCustomTemplates),
        );
      }
    } catch (e) {
      console.error("Failed to delete custom template:", e);
    }

    // Usuń z availableTemplates
    setAvailableTemplates((prev) =>
      prev.filter((t) => t.id !== templateToDelete.id),
    );

    // Jeśli usuwany szablon był wybrany, odznacz go
    if (selectedTemplate?.id === templateToDelete.id) {
      onSelect(null as any);
    }

    // Opcjonalnie: pokaż powiadomienie (jeśli masz snackbar)
    console.log(`Usunięto szablon: ${templateToDelete.name}`);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Wybierz Szablon Certyfikatu
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {availableTemplates.length} dostępnych szablonów
              {selectedTemplate && " • Kliknij wybrany aby odznaczyć"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Deselect Button - pokazuj tylko gdy jest wybrany szablon */}
            {selectedTemplate && (
              <button
                onClick={() => {
                  onSelect(null as any);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
                <span>Odznacz</span>
              </button>
            )}

            {/* Upload Custom Template Button */}
            <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
              </svg>
              <span>Wczytaj</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : availableTemplates.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <p className="text-gray-600">Brak dostępnych szablonów</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`group relative bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl ${selectedTemplate?.id === template.id
                      ? "border-blue-500 ring-4 ring-blue-100"
                      : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  {/* Selected Badge */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
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

                  {/* Delete Button for Custom Templates */}
                  {template.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomTemplate(e, template)}
                      className="absolute top-3 left-3 z-10 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
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

                  {/* Template Preview */}
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
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

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {template.name}
                      </h3>
                      {template.category && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                            template.category,
                          )}`}
                        >
                          {template.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                    {template.isCustom && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedTemplate ? (
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-green-600"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Wybrany: <strong>{selectedTemplate.name}</strong>
              </span>
            ) : (
              "Wybierz szablon aby kontynuować"
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
