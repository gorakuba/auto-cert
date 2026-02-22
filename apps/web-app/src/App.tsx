import { useEffect, useState } from "react";
import {
  Layout,
  Modal,
  Snackbar,
} from "./components";
import {
  CertificateGenerator,
  Dashboard,
  Tutorial,
  ZipExporter,
  CSVImporter
} from "./containers";
import { ParticipantsPage } from "./pages/ParticipantsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import type { Participant, TemplateInfo } from "./types";
import { api } from "./services/api";

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
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
    const initData = async () => {
      try {
        // Load tutorial status (localStorage)
        const tutorialCompleted = localStorage.getItem(
          "auto-cert-tutorial-completed",
        );
        if (!tutorialCompleted) {
          setShowTutorial(true);
        }

        // Load participants
        const backendParticipants = await api.participants.getAll();
        setParticipants(backendParticipants);
        setIsInitialized(true);

        // Load generated count
        const savedGenerated = await api.settings.get(
          "auto-cert-generated-count",
        );
        if (savedGenerated) {
          setGeneratedCount(parseInt(savedGenerated));
        }

        // Load selected template
        const savedTemplateStr = await api.settings.get(
          "auto-cert-selected-template",
        );
        if (savedTemplateStr) {
          try {
            setSelectedTemplate(JSON.parse(savedTemplateStr));
          } catch (e) {
            console.error(e);
          }
        }

        // Load custom templates from API
        const customTemplatesStr = await api.settings.get(
          "auto-cert-custom-templates",
        );
        if (customTemplatesStr) {
          try {
            const customTemplates = JSON.parse(customTemplatesStr);
            setTemplates((prev) => {
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
      } catch (e) {
        console.error("Failed to initialize data:", e);
        showSnackbar("Błąd ładowania danych", "error");
      }
    };

    initData();
  }, []);

  // Sync participants to API whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    // We use a timeout to debounce updates to avoid flooding API on rapid changes
    const timeoutId = setTimeout(() => {
      api.participants.setAll(participants).catch(e => console.error("Auto-save failed", e));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [participants, isInitialized]);

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

  const handleTemplateUpload = async (newTemplate: TemplateInfo) => {
    // Save to API
    const stored = await api.settings.get("auto-cert-custom-templates");
    let custom: TemplateInfo[] = [];
    if (stored) {
      try {
        custom = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse", e);
      }
    }
    custom.push(newTemplate);
    try {
      await api.settings.set("auto-cert-custom-templates", JSON.stringify(custom));
    } catch (e) {
      console.error("Failed to update API storage", e);
    }

    // Update state
    setTemplates((prev) => [newTemplate, ...prev]); // Add to top

    // Auto-select
    handleTemplateSelect(newTemplate);
  };

  const handleTemplateDelete = async (templateId: string) => {
    // Remove from API
    const stored = await api.settings.get("auto-cert-custom-templates");
    if (stored) {
      try {
        const custom: TemplateInfo[] = JSON.parse(stored);
        const updated = custom.filter((t) => t.id !== templateId);
        await api.settings.set("auto-cert-custom-templates", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update API metadata", e);
      }
    }

    // Update state
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));

    // If selected, deselect
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      await api.settings.set("auto-cert-selected-template", "");
    }
  };

  const handleTemplateSelect = async (template: TemplateInfo) => {
    setSelectedTemplate(template);
    // Store as JSON string in settings to keep consistency with previous logic,
    // though backend settings are key-value strings. 
    // We are trusting the backend settings table to hold this string.
    try {
      await api.settings.set("auto-cert-selected-template", JSON.stringify(template));
    } catch (e) {
      console.error("Failed to save selected template setting", e);
    }

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

  const handleTutorialComplete = async (data: {
    participants: Participant[];
    selectedTemplate: TemplateInfo | null;
    fileName?: string;
  }) => {
    if (data.participants.length > 0) {
      setParticipants(data.participants);
      // The useEffect will handle saving participants, or we can force it here
      await api.participants.setAll(data.participants);
    }
    if (data.selectedTemplate) {
      setSelectedTemplate(data.selectedTemplate);
      await api.settings.set("auto-cert-selected-template", JSON.stringify(data.selectedTemplate));
    }
    localStorage.setItem("auto-cert-tutorial-completed", "true");
    setShowTutorial(false);
  };

  const handleGenerated = async (count: number) => {
    const newCount = generatedCount + count;
    setGeneratedCount(newCount);
    await api.settings.set("auto-cert-generated-count", newCount.toString());
    showSnackbar(
      `Wygenerowano ${count} ${count === 1 ? "certyfikat" : "certyfikatów"
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
    const initProjects = async () => {
      try {
        const savedProjects = await api.settings.get("auto-cert-recent-projects");
        if (savedProjects) {
          setRecentProjects(JSON.parse(savedProjects));
        }
      } catch (e) {
        console.error("Failed to parse recent projects:", e);
      }
    };
    initProjects();
  }, []);

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
      const updated = [newProject, ...filtered].slice(0, 5); // Keep last 5
      api.settings.set("auto-cert-recent-projects", JSON.stringify(updated)).catch(e => console.error("Could not save to API", e));
      return updated;
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
          api.settings.set("auto-cert-recent-projects", JSON.stringify(updated)).catch(e => console.error("Could not save to API", e));
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
        <CSVImporter
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
