import { jsPDF } from "jspdf";
import { useEffect, useRef, useState } from "react";

interface Participant {
  id: string;
  name: string;
  email?: string;
  company?: string;
  score?: number;
  completionDate?: string;
}

interface TemplateInfo {
  id: string;
  name: string;
  path: string;
}

interface CertificateGeneratorProps {
  participants: Participant[];
  template: TemplateInfo | null;
  onGenerated: (count: number) => void;
  onSave?: () => void;
  onExport?: () => void; // Added for ZIP export
  hasUnsavedChanges?: boolean;
}

export const CertificateGenerator = ({
  participants,
  template,
  onGenerated,
  onSave,
  onExport,
  hasUnsavedChanges,
}: CertificateGeneratorProps) => {
  // ... (keep state)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [namePosition, setNamePosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const currentParticipant = participants[currentIndex];

  useEffect(() => {
    drawCertificate();
  }, [currentIndex, namePosition, fontSize, fontColor, fontFamily, template]);

  const drawCertificate = () => {
    // ... (keep logic, too long to repeat, relying on context match)
    const canvas = canvasRef.current;
    if (!canvas || !template) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw template
      ctx.drawImage(img, 0, 0);

      // Draw name
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = (namePosition.x / 100) * canvas.width;
      const y = (namePosition.y / 100) * canvas.height;

      ctx.fillText(currentParticipant?.name || "", x, y);
    };
    img.onerror = () => {
      console.error("Failed to load template image");
      // Draw fallback
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Szablon niedostępny", 400, 250);
      ctx.fillText("(Wczytywanie...)", 400, 290);

      // Still draw the name
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      const x = (namePosition.x / 100) * 800;
      const y = (namePosition.y / 100) * 600;
      ctx.fillText(currentParticipant?.name || "", x, y);
    };
    img.src = template.path;
  };
  // ... (keep downloads)
  const downloadCurrent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`certyfikat_${currentParticipant.name.replace(/\s+/g, "_")}.pdf`);
  };

  const downloadAllPDF = async () => {
    setGenerating(true);

    for (let i = 0; i < participants.length; i++) {
      setCurrentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = canvasRef.current;
      if (!canvas) continue;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`certyfikat_${participants[i].name.replace(/\s+/g, "_")}.pdf`);

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    onGenerated(participants.length);
    setGenerating(false);
    setCurrentIndex(0);
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    setNamePosition((prev) => ({ ...prev, [axis]: value }));
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
      {/* Header with Save Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Generator Certyfikatów
          </h1>
          <p className="text-gray-500 mt-1">
            Dostosuj wygląd i wygeneruj pliki PDF dla {participants.length}{" "}
            uczestników.
          </p>
        </div>

        {onSave && (
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              hasUnsavedChanges
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm animate-pulse"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M19.5 21a1.5 1.5 0 001.5-1.5V6.37a2.976 2.976 0 00-.868-2.118l-2.885-2.895A3.016 3.016 0 0015.114 1H6a3 3 0 00-3 3v15.5A2.99 2.99 0 005.969 21h13.531zM9 3v4a1 1 0 001 1h4a1 1 0 001-1V3H9zm9 18H6a1 1 0 01-1-1v-4h14v4a1 1 0 01-1 1z"
                clipRule="evenodd"
              />
            </svg>
            {hasUnsavedChanges ? "Zapisz Zmiany" : "Zapisano"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Podgląd Certyfikatu</h3>
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentIndex === 0}
                  className="p-1.5 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <div className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                  {currentIndex + 1} / {participants.length}
                </div>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(participants.length - 1, prev + 1),
                    )
                  }
                  disabled={currentIndex === participants.length - 1}
                  className="p-1.5 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
              <div className="shadow-2xl rounded-sm overflow-hidden bg-white max-h-full max-w-full">
                <canvas
                  ref={canvasRef}
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentParticipant?.name || "Brak uczestnika"}
                </p>
                {currentParticipant?.email && (
                  <p className="text-xs text-gray-500">
                    {currentParticipant.email}
                  </p>
                )}
              </div>
              <button
                onClick={downloadCurrent}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-semibold shadow-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400"
                >
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.965 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Pobierz Podgląd
              </button>
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              Typografia
            </h3>

            <div className="space-y-6">
              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Rozmiar
                  </label>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                  Czcionka
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                  Kolor
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a.75.75 0 01.75.75v12.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z"
                  clipRule="evenodd"
                />
              </svg>
              Pozycja
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Pionowo (Y)
                  </label>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {namePosition.y}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={namePosition.y}
                  onChange={(e) =>
                    handlePositionChange("y", parseInt(e.target.value))
                  }
                  className="w-full accent-indigo-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Poziomo (X)
                  </label>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {namePosition.x}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={namePosition.x}
                  onChange={(e) =>
                    handlePositionChange("x", parseInt(e.target.value))
                  }
                  className="w-full accent-indigo-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={downloadAllPDF}
              disabled={generating}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/80"></div>
                  Generowanie...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generuj Certyfikaty
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">
              Zostanie wygenerowanych {participants.length} plików PDF.
            </p>
            {onExport && (
              <button
                onClick={onExport}
                className="w-full mt-3 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                </svg>
                Eksportuj ZIP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
