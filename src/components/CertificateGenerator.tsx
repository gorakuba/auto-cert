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
  onClose: () => void;
  onGenerated: (count: number) => void;
}

export const CertificateGenerator = ({
  participants,
  template,
  onClose,
  onGenerated,
}: CertificateGeneratorProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Powrót do Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Generator Certyfikatów
            </h1>
            <p className="text-gray-600 mt-2">
              {participants.length} certyfikatów do wygenerowania
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="lg:col-span-2">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Podgląd</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentIndex((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentIndex === 0}
                        className="p-2 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span className="text-sm font-medium text-gray-700 px-3">
                        {currentIndex + 1} / {participants.length}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentIndex((prev) =>
                            Math.min(participants.length - 1, prev + 1),
                          )
                        }
                        disabled={currentIndex === participants.length - 1}
                        className="p-2 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto"
                      style={{ maxHeight: "60vh" }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">
                        {currentParticipant?.name || "Brak uczestnika"}
                      </p>
                      {currentParticipant?.email && (
                        <p className="text-xs">{currentParticipant.email}</p>
                      )}
                    </div>
                    <button
                      onClick={downloadCurrent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Pobierz
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Ustawienia Tekstu
                  </h3>

                  {/* Font Size */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rozmiar czcionki: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Font Family */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Czcionka
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                    </select>
                  </div>

                  {/* Font Color */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kolor tekstu
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Position X */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pozycja X: {namePosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={namePosition.x}
                      onChange={(e) =>
                        handlePositionChange("x", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Position Y */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pozycja Y: {namePosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={namePosition.y}
                      onChange={(e) =>
                        handlePositionChange("y", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={downloadAllPDF}
                    disabled={generating}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                          <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
                        </svg>
                        Pobierz wszystkie ({participants.length})
                      </>
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    <div>
                      <p className="font-semibold mb-1">Wskazówka</p>
                      <p className="text-xs">
                        Dostosuj pozycję i wygląd tekstu, następnie kliknij
                        "Pobierz Wszystkie" aby wygenerować certyfikaty PDF dla
                        wszystkich uczestników.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
