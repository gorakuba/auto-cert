import { useState } from "react";
import type { Participant, TemplateInfo } from "../types";
import { Modal } from "../components";

interface TutorialProps {
  onComplete: (data: {
    participants: Participant[];
    selectedTemplate: TemplateInfo | null;
    fileName?: string;
  }) => void;
  templates: TemplateInfo[];
}

export function Tutorial({ onComplete, templates }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(
    null,
  );
  const [fileName, setFileName] = useState<string | undefined>(undefined);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple CSV parsing
      const lines = text.split("\n").filter((line) => line.trim());
      if (lines.length < 2) {
        showAlert(
          "Błąd formatu",
          "Plik musi zawierać nagłówki i przynajmniej jeden wiersz danych",
          "error",
        );
        return;
      }

      const headers = lines[0].split(/[,;]/).map((h) => h.trim().toLowerCase());
      const nameIndex = headers.findIndex((h) =>
        ["name", "imię", "imie", "nazwa", "full name", "fullname"].includes(h),
      );

      if (nameIndex === -1) {
        showAlert(
          "Brak kolumny z imieniem",
          'Nie znaleziono kolumny z imieniem. Upewnij się, że nagłówek to "name" lub "imię"',
          "error",
        );
        return;
      }

      const parsedParticipants: Participant[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[,;]/).map((v) => v.trim());
        if (values[nameIndex]) {
          const participant: Participant = {
            id: crypto.randomUUID(),
            name: values[nameIndex],
          };

          // Optional fields
          const emailIndex = headers.findIndex((h) =>
            ["email", "e-mail", "mail"].includes(h),
          );
          const companyIndex = headers.findIndex((h) =>
            ["company", "firma", "organization", "organizacja"].includes(h),
          );

          if (emailIndex !== -1 && values[emailIndex]) {
            participant.email = values[emailIndex];
          }
          if (companyIndex !== -1 && values[companyIndex]) {
            participant.company = values[companyIndex];
          }

          parsedParticipants.push(participant);
        }
      }

      if (parsedParticipants.length === 0) {
        showAlert(
          "Brak danych",
          "Nie udało się zaimportować żadnych uczestników",
          "error",
        );
        return;
      }

      setParticipants(parsedParticipants);
    };

    reader.readAsText(file);
  };

  const handleNext = () => {
    if (currentStep === 1 && participants.length === 0) {
      showAlert(
        "Brak uczestników",
        "Najpierw zaimportuj uczestników",
        "warning",
      );
      return;
    }
    if (currentStep === 2 && !selectedTemplate) {
      showAlert("Brak szablonu", "Najpierw wybierz szablon", "warning");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete tutorial
      onComplete({ participants, selectedTemplate, fileName });
    }
  };

  const handleSkipTutorial = () => {
    onComplete({ participants: [], selectedTemplate: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎓 Witaj w AutoCert!
          </h1>
          <p className="text-lg text-gray-600">
            Utwórz swoje pierwsze certyfikaty w 3 prostych krokach
          </p>
          <button
            onClick={handleSkipTutorial}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Pomiń tutorial i przejdź do aplikacji
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    step === currentStep
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : step < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                {idx < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👥</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Krok 1: Importuj Uczestników
                </h2>
                <p className="text-gray-600 text-lg">
                  Dodaj listę osób, które otrzymają certyfikaty
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📄</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Przeciągnij plik lub kliknij aby wybrać
                    </p>
                    <p className="text-sm text-gray-500">
                      Obsługujemy pliki CSV i Excel (.xlsx, .xls)
                    </p>
                  </label>
                </div>

                {participants.length > 0 && (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-green-900">
                          Zaimportowano pomyślnie!
                        </p>
                        <p className="text-sm text-green-700">
                          {fileName} - {participants.length} uczestników
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Podgląd:
                      </p>
                      <ul className="space-y-1">
                        {participants.slice(0, 5).map((p) => (
                          <li key={p.id} className="text-sm text-gray-600">
                            • {p.name}
                            {p.company && ` - ${p.company}`}
                          </li>
                        ))}
                        {participants.length > 5 && (
                          <li className="text-sm text-gray-500 italic">
                            ... i {participants.length - 5} więcej
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    💡 Wskazówka:
                  </p>
                  <p className="text-sm text-blue-800">
                    Twój plik powinien zawierać kolumnę "name" lub "imię".
                    Opcjonalnie możesz dodać "email" i "company" (firma).
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎨</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Krok 2: Wybierz Szablon
                </h2>
                <p className="text-gray-600 text-lg">
                  Wybierz wygląd swoich certyfikatów
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id
                        ? "border-purple-600 bg-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📜</span>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl max-w-3xl mx-auto">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-purple-900">
                        Wybrano szablon:
                      </p>
                      <p className="text-sm text-purple-700">
                        {selectedTemplate.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Gotowe! Wszystko skonfigurowane
                </h2>
                <p className="text-gray-600 text-lg">
                  Możesz teraz przejść do generowania certyfikatów
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="p-6 bg-white border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Uczestnicy</p>
                      <p className="text-sm text-gray-600">
                        {participants.length} osób
                        {fileName && ` z pliku ${fileName}`}
                      </p>
                    </div>
                    <div className="text-green-600 text-2xl">✓</div>
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Szablon</p>
                      <p className="text-sm text-gray-600">
                        {selectedTemplate?.name}
                      </p>
                    </div>
                    <div className="text-green-600 text-2xl">✓</div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl">
                  <p className="text-center text-gray-900 font-semibold mb-2">
                    🎉 Wszystko gotowe do działania!
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Kliknij "Zakończ" aby przejść do dashboardu i rozpocząć
                    generowanie certyfikatów
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Wstecz
          </button>

          <div className="text-sm text-gray-600">Krok {currentStep} z 3</div>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            {currentStep === 3 ? "Zakończ Tutorial" : "Dalej →"}
          </button>
        </div>
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
}
