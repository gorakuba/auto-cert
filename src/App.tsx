import { useEffect, useState } from "react";
import {
  CertificateGenerator,
  Dashboard,
  Layout,
  Modal,
  Snackbar,
  Tutorial,
  ZipExporter,
} from "./components";
import { SimpleCSVImporter } from "./containers/SimpleCSVImporter/SimpleCSVImporter";
import { ParticipantsPage } from "./pages/ParticipantsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import type { Participant, TemplateInfo } from "./types";

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [templates, setTemplates] = useState<TemplateInfo[]>([
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
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(
    templates[0],
  );
  const [generatedCount, setGeneratedCount] = useState(0);

  // Modals
  const [showImporter, setShowImporter] = useState(false);
  const [showZipExporter, setShowZipExporter] = useState(false);

  // ... (keeping snackbar state)

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showSnackbar = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "success",
  ) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar({ isOpen: false, message: "", type: "info" });
  };

  // Modal for important confirmations (keep for warnings that need confirmation)
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    onConfirm?: () => void;
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
    onConfirm?: () => void,
  ) => {
    setAlertModal({ isOpen: true, title, message, type, onConfirm });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");

  // Load custom templates and data
  useEffect(() => {
    // Check if tutorial has been completed
    const tutorialCompleted = localStorage.getItem(
      "auto-cert-tutorial-completed",
    );
    if (!tutorialCompleted) {
      setShowTutorial(true);
      return;
    }

    // Load participants
    const savedParticipants = localStorage.getItem("auto-cert-participants");
    if (savedParticipants) {
      try {
        setParticipants(JSON.parse(savedParticipants));
      } catch (e) {
        console.error("Failed to parse participants:", e);
      }
    }

    // Load custom templates
    const customTemplatesStr = localStorage.getItem(
      "auto-cert-custom-templates",
    );
    if (customTemplatesStr) {
      try {
        const customTemplates = JSON.parse(customTemplatesStr);
        setTemplates((prev) => {
          // Avoid duplicates if strict mode double-invokes
          const ids = new Set(prev.map((t) => t.id));
          const newCustoms = customTemplates.filter(
            (t: TemplateInfo) => !ids.has(t.id),
          );
          return [...prev, ...newCustoms];
        });
      } catch (e) {
        console.error("Failed to parse custom templates:", e);
      }
    }

    const savedGenerated = localStorage.getItem("auto-cert-generated-count");
    if (savedGenerated) {
      setGeneratedCount(parseInt(savedGenerated));
    }

    const savedTemplate = localStorage.getItem("auto-cert-selected-template");
    if (savedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(savedTemplate));
      } catch (e) {
        console.error("Failed to parse selected template:", e);
      }
    }
  }, []);

  // Save participants to localStorage whenever they change
  useEffect(() => {
    if (participants.length > 0) {
      localStorage.setItem(
        "auto-cert-participants",
        JSON.stringify(participants),
      );
    }
  }, [participants]);

  // Automatycznie otwórz generator gdy są uczestnicy i szablon (tylko za pierwszym razem)
  useEffect(() => {
    const generatorAutoOpened = localStorage.getItem(
      "auto-cert-generator-auto-opened",
    );

    if (
      participants.length > 0 &&
      selectedTemplate &&
      !generatorAutoOpened &&
      !showTutorial &&
      !showImporter
    ) {
      // NOTE: With page architecture we might want to revisit this auto-opening behavior
      // For now, let's keep it but perhaps it should redirect to generator?
      // setShowGenerator(true);  <-- Disabled for now to favor explicit actions in new UI
      // localStorage.setItem("auto-cert-generator-auto-opened", "true");
    }
  }, [participants.length, selectedTemplate, showTutorial, showImporter]);

  const handleQuickAction = (action: string) => {
    console.log("Quick action triggered:", action);

    switch (action) {
      case "import-csv":
        // Import is still a specific action, can remain a modal or go to participants page
        setShowImporter(true);
        break;
      case "templates":
        setActiveTab("templates");
        break;
      case "generate":
        if (!selectedTemplate) {
          showAlert(
            "Brak szablonu",
            "Najpierw wybierz szablon certyfikatu!",
            "warning",
            () => setActiveTab("templates"),
          );
        } else if (participants.length === 0) {
          showAlert(
            "Brak uczestników",
            "Najpierw zaimportuj uczestników!",
            "warning",
            () => {
              setActiveTab("participants");
              setShowImporter(true);
            },
          );
        } else {
          setActiveTab("generator");
        }
        break;
      case "manage-participants":
        setActiveTab("participants");
        break;
      case "projects":
        showSnackbar(
          "Funkcjonalność zarządzania projektami będzie dostępna wkrótce! 🚀",
          "info",
        );
        break;
      case "export-zip":
        if (!selectedTemplate) {
          showAlert(
            "Brak szablonu",
            "Najpierw wybierz szablon certyfikatu!",
            "warning",
            () => setActiveTab("templates"),
          );
        } else if (participants.length === 0) {
          showAlert(
            "Brak uczestników",
            "Najpierw zaimportuj uczestników!",
            "warning",
            () => {
              setActiveTab("participants");
              setShowImporter(true);
            },
          );
        } else {
          setShowZipExporter(true);
        }
        break;
      default:
        break;
    }
  };

  const resetProject = () => {
    setParticipants([]);
    setSelectedTemplate(null);
    setActiveTab("templates");
    showSnackbar("Rozpoczęto nowy projekt. Wybierz szablon!", "info");
  };

  const handleImport = (newParticipants: Participant[], _fileName: string) => {
    setParticipants([...participants, ...newParticipants]);
    setShowImporter(false);

    if (selectedTemplate) {
      setActiveTab("generator");
      showSnackbar(
        `Zaimportowano dane. Przechodzę do generatora! 🚀`,
        "success",
      );
    } else {
      setActiveTab("templates");
      showSnackbar(`Zaimportowano dane. Wybierz szablon certyfikatu!`, "info");
    }
  };

  const handleUpdateParticipants = (updated: Participant[]) => {
    setParticipants(updated);
  };

  const handleTemplateUpload = (newTemplate: TemplateInfo) => {
    // Save to localStorage
    const stored = localStorage.getItem("auto-cert-custom-templates");
    let custom: TemplateInfo[] = [];
    if (stored) {
      try {
        custom = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse", e);
      }
    }
    custom.push(newTemplate);
    localStorage.setItem("auto-cert-custom-templates", JSON.stringify(custom));

    // Update state
    setTemplates((prev) => [newTemplate, ...prev]); // Add to top

    // Auto-select
    handleTemplateSelect(newTemplate);
  };

  const handleTemplateDelete = (templateId: string) => {
    // Remove from localStorage
    const stored = localStorage.getItem("auto-cert-custom-templates");
    if (stored) {
      try {
        const custom: TemplateInfo[] = JSON.parse(stored);
        const updated = custom.filter((t) => t.id !== templateId);
        localStorage.setItem(
          "auto-cert-custom-templates",
          JSON.stringify(updated),
        );
      } catch (e) {
        console.error("Failed to update storage", e);
      }
    }

    // Update state
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));

    // If selected, deselect
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      localStorage.removeItem("auto-cert-selected-template");
    }
  };

  const handleTemplateSelect = (template: TemplateInfo) => {
    setSelectedTemplate(template);
    localStorage.setItem(
      "auto-cert-selected-template",
      JSON.stringify(template),
    );

    if (participants.length > 0) {
      setActiveTab("generator");
      showSnackbar(`Wybrano szablon. Przechodzę do generatora! ✨`, "success");
    } else {
      // setActiveTab("participants"); // Disabled as per user request to stay on templates
      showSnackbar(
        `Wybrano szablon: ${template.name}. Pamiętaj o dodaniu uczestników!`,
        "info",
      );
    }
  };

  const handleTutorialComplete = (data: {
    participants: Participant[];
    selectedTemplate: TemplateInfo | null;
    fileName?: string;
  }) => {
    if (data.participants.length > 0) {
      setParticipants(data.participants);
      localStorage.setItem(
        "auto-cert-participants",
        JSON.stringify(data.participants),
      );
    }
    if (data.selectedTemplate) {
      setSelectedTemplate(data.selectedTemplate);
      localStorage.setItem(
        "auto-cert-selected-template",
        JSON.stringify(data.selectedTemplate),
      );
    }
    localStorage.setItem("auto-cert-tutorial-completed", "true");
    setShowTutorial(false);
  };

  const handleGenerated = (count: number) => {
    const newCount = generatedCount + count;
    setGeneratedCount(newCount);
    localStorage.setItem("auto-cert-generated-count", newCount.toString());
    showSnackbar(
      `Wygenerowano ${count} ${
        count === 1 ? "certyfikat" : "certyfikatów"
      }! 🎉`,
      "success",
    );
  };

  const handleZipExported = () => {
    handleGenerated(participants.length);
    showSnackbar(
      `Wyeksportowano ${participants.length} certyfikatów do ZIP! 📦`,
      "success",
    );
  };

  // Recent Projects State
  const [recentProjects, setRecentProjects] = useState<
    import("./types").RecentProject[]
  >([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem("auto-cert-recent-projects");
    if (savedProjects) {
      try {
        setRecentProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse recent projects:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "auto-cert-recent-projects",
      JSON.stringify(recentProjects),
    );
  }, [recentProjects]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mark project as unsaved when changes occur
  useEffect(() => {
    if (activeTab === "generator" && selectedTemplate) {
      setHasUnsavedChanges(true);
    }
  }, [selectedTemplate, participants, activeTab]);

  const saveCurrentProject = () => {
    if (!selectedTemplate) return;

    const projectId = selectedTemplate.id;

    const newProject: import("./types").RecentProject = {
      id: projectId,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      templateThumbnail: selectedTemplate.thumbnail || selectedTemplate.path,
      participants: participants,
      participantsCount: participants.length,
      lastEdited: Date.now(),
    };

    setRecentProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== projectId);
      return [newProject, ...filtered].slice(0, 5); // Keep last 5
    });

    setHasUnsavedChanges(false);
    showSnackbar("Projekt został zapisany!", "success");
  };

  const handleManualSave = () => {
    saveCurrentProject();
  };

  const handleDeleteProject = (projectId: string) => {
    showAlert(
      "Usuń projekt",
      "Czy na pewno chcesz usunąć ten projekt? Tej operacji nie można cofnąć.",
      "warning",
      () => {
        setRecentProjects((prev) => {
          const updated = prev.filter((p) => p.id !== projectId);
          return updated;
        });
        showSnackbar("Projekt został usunięty.", "success");
      },
    );
  };

  const handleOpenProject = (project: import("./types").RecentProject) => {
    const template = templates.find((t) => t.id === project.templateId);
    if (template) {
      setSelectedTemplate(template);
      setParticipants(project.participants);
      setHasUnsavedChanges(false);
      setActiveTab("generator");
      showSnackbar(`Otwarto projekt: ${project.templateName}`, "success");
    } else {
      showSnackbar("Szablon projektu nie istnieje.", "error");
    }
  };

  // Show tutorial if not completed
  if (showTutorial) {
    return (
      <Tutorial onComplete={handleTutorialComplete} templates={templates} />
    );
  }

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (
            activeTab === "generator" &&
            hasUnsavedChanges &&
            tab !== "generator"
          ) {
            showAlert(
              "Niezapisane zmiany",
              "Masz niezapisane zmiany. Czy na pewno chcesz opuścić generator?",
              "warning",
              () => {
                setHasUnsavedChanges(false);
                setActiveTab(tab);
              },
            );
            return;
          }

          if (tab === "generator") {
            if (!selectedTemplate) {
              showAlert(
                "Brak szablonu",
                "Najpierw wybierz szablon certyfikatu!",
                "warning",
                () => setActiveTab("templates"),
              );
            } else if (participants.length === 0) {
              showAlert(
                "Brak uczestników",
                "Najpierw zaimportuj uczestników!",
                "warning",
                () => {
                  setActiveTab("participants");
                  setShowImporter(true);
                },
              );
            } else {
              setActiveTab("generator");
            }
          } else {
            setActiveTab(tab);
          }
        }}
        counts={{
          participants: participants.length,
          templates: templates.length,
          projects: recentProjects.length,
        }}
      >
        {activeTab === "dashboard" && (
          <Dashboard
            participants={participants}
            templates={templates}
            generatedCount={generatedCount}
            onQuickAction={handleQuickAction}
            selectedTemplate={selectedTemplate}
            recentProjects={recentProjects}
            onOpenProject={handleOpenProject}
            onNewProject={resetProject}
          />
        )}

        {activeTab === "participants" && (
          <ParticipantsPage
            participants={participants}
            onUpdate={handleUpdateParticipants}
            onImportMore={() => setShowImporter(true)}
            onDelete={(name) =>
              showSnackbar(`Usunięto uczestnika: ${name}`, "success")
            }
            onShowSnackbar={showSnackbar}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsPage
            projects={recentProjects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onNewProject={resetProject}
          />
        )}

        {activeTab === "templates" && (
          <TemplatesPage
            templates={templates} // Passing defaults
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
            onUpload={handleTemplateUpload}
            onDelete={handleTemplateDelete}
          />
        )}

        {activeTab === "generator" && selectedTemplate && (
          <CertificateGenerator
            participants={participants}
            template={selectedTemplate}
            onGenerated={handleGenerated}
            onSave={handleManualSave}
            onExport={() => setShowZipExporter(true)}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
      </Layout>

      {/* Modals */}
      {showImporter && (
        <SimpleCSVImporter
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}

      {/* Deprecated: showParticipantManager and showTemplateSelector logic removed/replaced by pages */}

      {showZipExporter && selectedTemplate && (
        <ZipExporter
          participants={participants}
          template={selectedTemplate}
          onClose={() => setShowZipExporter(false)}
          onExported={handleZipExported}
        />
      )}

      {/* Alert Modal */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />

      {/* Snackbar for success/info notifications */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </>
  );
}

export default App;
