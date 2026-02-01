import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";

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

interface ZipExporterProps {
  participants: Participant[];
  template: TemplateInfo | null;
  onClose: () => void;
  onExported: () => void;
}

export const ZipExporter = ({
  participants,
  template,
  onClose,
  onExported,
}: ZipExporterProps) => {
  const [progress, setProgress] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default certificate settings
  const namePosition = { x: 50, y: 50 };
  const fontSize = 48;
  const fontColor = "#000000";
  const fontFamily = "Arial";

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
  ) => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  const generateCertificateBlob = (
    participant: Participant,
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas || !template) {
        resolve(null);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
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

        ctx.fillText(participant.name, x, y);

        // Convert canvas to PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        const pdfBlob = pdf.output("blob");
        resolve(pdfBlob);
      };
      img.onerror = () => {
        // Fallback with no template
        canvas.width = 800;
        canvas.height = 600;
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, 800, 600);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        const x = (namePosition.x / 100) * 800;
        const y = (namePosition.y / 100) * 600;
        ctx.fillText(participant.name, x, y);

        // Convert canvas to PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [800, 600],
        });

        pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
        const pdfBlob = pdf.output("blob");
        resolve(pdfBlob);
      };
      img.src = template.path;
    });
  };

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder("certyfikaty");

    if (!folder) {
      alert("Błąd tworzenia archiwum");
      setExporting(false);
      return;
    }

    // Generate all certificates
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      setCurrentName(participant.name);
      setProgress(((i + 1) / participants.length) * 100);

      const blob = await generateCertificateBlob(participant);
      if (blob) {
        const fileName = `certyfikat_${participant.name.replace(
          /\s+/g,
          "_",
        )}.pdf`;
        folder.file(fileName, blob);
      }

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Generate and download ZIP
    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certyfikaty_${new Date().toISOString().split("T")[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      onExported();

      showAlert(
        "Eksport zakończony! 🎉",
        `Pomyślnie wyeksportowano ${participants.length} certyfikatów do pliku ZIP.\nPlik zostanie pobrany automatycznie.`,
        "success",
      );

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error generating ZIP:", error);
      showAlert(
        "Błąd eksportu",
        "Wystąpił problem podczas tworzenia archiwum ZIP. Spróbuj ponownie.",
        "error",
      );
    }

    setExporting(false);
  };

  useEffect(() => {
    if (!exporting) {
      handleExport();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Eksportowanie do ZIP
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Trwa generowanie {participants.length} certyfikatów PDF...
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Postęp</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current File */}
          {currentName && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Przetwarzanie:</span>{" "}
                {currentName}
              </p>
            </div>
          )}

          {/* Spinner */}
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-gray-600">
            <p>Proszę czekać, nie zamykaj tego okna...</p>
          </div>

          {/* Hidden canvas for rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        {progress === 100 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-green-50">
            <div className="flex items-center gap-2 text-green-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span className="font-semibold">
                Eksport zakończony! Pobieranie...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alert Modal */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};
