import { useRef } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../components/Modal/Modal";

interface CSVImporterUIProps {
  onClose: () => void;
  onImport: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  setIsDragging: (isDragging: boolean) => void;
  onClearFile: () => void;
  isDragging: boolean;
  preview: string[][];
  fileName: string;
  alertModal: {
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
  };
  closeAlert: () => void;
}

export const Content = ({
  onClose,
  onImport,
  onFileSelect,
  onDrop,
  setIsDragging,
  onClearFile,
  isDragging,
  preview,
  fileName,
  alertModal,
  closeAlert,
}: CSVImporterUIProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[5001] p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-black/5">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Importuj Uczestników
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Wgraj plik CSV lub Excel
              </p>
            </div>
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

          <div className="p-8">
            {preview.length === 0 ? (
              <div
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 bg-gray-50"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                >
                  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
                </svg>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Przeciągnij plik CSV lub Excel tutaj
                </p>
                <p className="text-sm text-gray-600 mb-4">lub</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Wybierz Plik
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.xlsm"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4">
                  Obsługiwane formaty: CSV, XLSX, XLS, XLSM
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Format: Imię, Email, Firma, Wynik, Data
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Plik:</p>
                    <p className="font-semibold text-gray-900">{fileName}</p>
                  </div>
                  <button
                    onClick={onClearFile}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Zmień plik
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Podgląd ({preview.length - 1} wierszy)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          {preview[0]?.map((header, i) => (
                            <th
                              key={i}
                              className="text-left py-2 px-3 font-semibold text-gray-700"
                            >
                              {header || `Kolumna ${i + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.slice(1, 6).map((row, i) => (
                          <tr key={i} className="border-b border-gray-200">
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-3 text-gray-600">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {preview.length > 6 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ... i {preview.length - 6} więcej wierszy
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={onImport}
              disabled={preview.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Importuj {preview.length > 1 ? `(${preview.length - 1})` : ""}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>,
    document.body,
  );
};
