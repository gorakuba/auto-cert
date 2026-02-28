import { useState } from "react";
import * as XLSX from "xlsx";
import { parseCSV } from "./csvParser";
import { Content } from "./components/Content";

interface Participant {
  id: string;
  name: string;
  email?: string;
  company?: string;
  score?: number;
  completionDate?: string;
}

interface CSVImporterProps {
  onImport: (participants: Participant[], fileName: string) => void;
  onClose: () => void;
}

export const CSVImporter = ({ onImport, onClose }: CSVImporterProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
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
    type: "info" | "success" | "warning" | "error" = "error",
  ) => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  const processFile = (file: File) => {
    const isExcel =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsm");

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        setPreview(jsonData as string[][]);
        setFileName(file.name);
      };
      reader.readAsBinaryString(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setPreview(data);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsm"))
    ) {
      processFile(file);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;

    const participants: Participant[] = [];
    const hasHeader = preview[0].some(
      (cell) =>
        cell.toLowerCase().includes("name") ||
        cell.toLowerCase().includes("email") ||
        cell.toLowerCase().includes("imię"),
    );

    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < preview.length; i++) {
      const row = preview[i];
      if (row.length === 0 || !row[0]) continue;

      participants.push({
        id: `p-${Date.now()}-${i}`,
        name: row[0],
        email: row[1] || undefined,
        company: row[2] || undefined,
        score: row[3] ? parseFloat(row[3]) : undefined,
        completionDate: row[4] || undefined,
      });
    }

    if (participants.length === 0) {
      showAlert(
        "Brak danych",
        "Nie znaleziono żadnych uczestników do zaimportowania.",
        "error",
      );
      return;
    }

    onImport(participants, fileName);
    onClose();
  };

  return (
    <Content
      onClose={onClose}
      onImport={handleImport}
      onFileSelect={handleFileSelect}
      onDrop={handleDrop}
      setIsDragging={setIsDragging}
      onClearFile={() => {
        setPreview([]);
        setFileName("");
      }}
      isDragging={isDragging}
      preview={preview}
      fileName={fileName}
      alertModal={alertModal}
      closeAlert={closeAlert}
    />
  );
};
