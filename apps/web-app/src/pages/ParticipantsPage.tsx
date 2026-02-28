import { useState } from "react";
import { ParticipantEmptyState } from "../containers/ParticipantManager";
import { ParticipantRow } from "../containers/ParticipantManager";
import { SearchToolbar } from "../components/SeachToolbar/SearchToolbar";
import { Modal } from "../components/Modal/Modal";
import type { Participant } from "../types";

interface ParticipantsPageProps {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
  onImportMore: () => void;
  onDelete?: (participantName: string) => void;
  onShowSnackbar: (
    message: string,
    type: "info" | "success" | "warning" | "error",
  ) => void;
}

export const ParticipantsPage = ({
  participants,
  onUpdate,
  onImportMore,
  onDelete,
  onShowSnackbar,
}: ParticipantsPageProps) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    participantId: string | null;
    participantName: string;
  }>({
    isOpen: false,
    participantId: null,
    participantName: "",
  });
  const [deleteAllModal, setDeleteAllModal] = useState(false);

  const filters = [
    { id: "all", label: "Wszyscy" },
    { id: "with-email", label: "Z e-mailem" },
    { id: "with-score", label: "Z wynikiem" },
  ];

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.company?.toLowerCase() || "").includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "with-email") return p.email && p.email.trim() !== "";
    if (activeFilter === "with-score")
      return p.score !== undefined && p.score !== null;

    return true;
  });

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id);
  };

  const handleSave = (participant: Participant) => {
    const updated = participants.map((p) =>
      p.id === participant.id ? participant : p,
    );
    onUpdate(updated);
    setEditingId(null);
    onShowSnackbar(
      "Dane uczestnika zostały zaktualizowane pomyślnie.",
      "success",
    );
  };

  const handleDelete = (participant: Participant) => {
    setDeleteModal({
      isOpen: true,
      participantId: participant.id,
      participantName: participant.name,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.participantId) {
      onUpdate(participants.filter((p) => p.id !== deleteModal.participantId));
      if (onDelete) {
        onDelete(deleteModal.participantName);
      }
    }
    setDeleteModal({ isOpen: false, participantId: null, participantName: "" });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, participantId: null, participantName: "" });
  };

  const [addMethodModalOpen, setAddMethodModalOpen] = useState(false);
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [newParticipantData, setNewParticipantData] = useState<
    Partial<Participant>
  >({});

  const handleAddClick = () => {
    setAddMethodModalOpen(true);
  };

  const handleManualAddOpen = () => {
    setAddMethodModalOpen(false);
    setNewParticipantData({
      id: `p-${Date.now()}`,
      name: "",
      email: "",
      company: "",
      score: undefined,
      completionDate: new Date().toISOString().split("T")[0],
    });
    setManualAddOpen(true);
  };

  const handleFileImportOpen = () => {
    setAddMethodModalOpen(false);
    onImportMore();
  };

  const confirmManualAdd = () => {
    if (!newParticipantData.name) {
      onShowSnackbar("Imię i nazwisko jest wymagane", "error");
      return;
    }

    const newParticipant: Participant = {
      id: newParticipantData.id || `p-${Date.now()}`,
      name: newParticipantData.name,
      email: newParticipantData.email,
      company: newParticipantData.company,
      score: newParticipantData.score,
      completionDate: newParticipantData.completionDate,
    };

    onUpdate([...participants, newParticipant]);
    setManualAddOpen(false);
    onShowSnackbar("Dodano nowego uczestnika", "success");
  };

  const handleDeleteAll = () => {
    setDeleteAllModal(true);
  };

  const confirmDeleteAll = () => {
    onUpdate([]);
    setDeleteAllModal(false);
    if (onDelete) {
      onDelete("wszystkich uczestników");
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Zarządzaj Uczestnikami
          </h1>
          <p className="text-gray-500 mt-1">
            Przeglądaj, edytuj i dodawaj uczestników do certyfikatów.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Dodaj uczestników
        </button>
      </div>

      <SearchToolbar
        value={search}
        onChange={setSearch}
        placeholder="Szukaj uczestnika..."
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      >
        {participants.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Usuń wszystkich
          </button>
        )}
      </SearchToolbar>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredParticipants.length > 0 && (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-full table-auto">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider pl-6">
                      Imię i Nazwisko
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Firma
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Wynik
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <ParticipantRow
                        participant={participant}
                        isEditing={editingId === participant.id}
                        onEditStart={handleEdit}
                        onSave={handleSave}
                        onCancelEdit={() => setEditingId(null)}
                        onDelete={handleDelete}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
              <p className="text-sm text-gray-500">
                Wyświetlono {filteredParticipants.length} z{" "}
                {participants.length}
              </p>
            </div>
          </>
        )}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="flex-1 flex flex-col mt-4">
          <ParticipantEmptyState search={search} />
        </div>
      )}

      <Modal
        isOpen={addMethodModalOpen}
        onClose={() => setAddMethodModalOpen(false)}
        title="Dodaj uczestników"
        type="info"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleManualAddOpen}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-indigo-700">
              Ręcznie
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Wypełnij formularz
            </span>
          </button>
          <button
            onClick={handleFileImportOpen}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.25 4.533A9.707 9.707 0 006 13.581 3 3 0 016 15h11.25a3 3 0 000-6 4.5 4.5 0 00-6-5.467zM7.5 18a1.5 1.5 0 000 3h9a1.5 1.5 0 000-3h-9z" />
                <path
                  fillRule="evenodd"
                  d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 3.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-blue-700">
              Z pliku
            </span>
            <span className="text-xs text-gray-500 mt-1">CSV lub Excel</span>
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={manualAddOpen}
        onClose={() => setManualAddOpen(false)}
        title="Dodaj uczestnika"
        message="Wprowadź dane nowego uczestnika."
        type="info"
        confirmText="Dodaj"
        cancelText="Anuluj"
        onConfirm={confirmManualAdd}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię i Nazwisko *
            </label>
            <input
              type="text"
              value={newParticipantData.name || ""}
              onChange={(e) =>
                setNewParticipantData({
                  ...newParticipantData,
                  name: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="np. Jan Kowalski"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newParticipantData.email || ""}
              onChange={(e) =>
                setNewParticipantData({
                  ...newParticipantData,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="np. jan@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Firma / Organizacja
            </label>
            <input
              type="text"
              value={newParticipantData.company || ""}
              onChange={(e) =>
                setNewParticipantData({
                  ...newParticipantData,
                  company: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="np. Firma XYZ"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wynik (%)
              </label>
              <input
                type="number"
                value={newParticipantData.score || ""}
                onChange={(e) =>
                  setNewParticipantData({
                    ...newParticipantData,
                    score: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0-100"
                max="100"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data ukończenia
              </label>
              <input
                type="date"
                value={newParticipantData.completionDate || ""}
                onChange={(e) =>
                  setNewParticipantData({
                    ...newParticipantData,
                    completionDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        title="Usuń uczestnika"
        message={`Czy na pewno chcesz usunąć użytkownika "${deleteModal.participantName}"?\nTej operacji nie można cofnąć.`}
        type="warning"
        confirmText="Usuń"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
      />

      <Modal
        isOpen={deleteAllModal}
        onClose={() => setDeleteAllModal(false)}
        title="Usuń wszystkich uczestników"
        message={`Czy na pewno chcesz usunąć wszystkich ${participants.length} uczestników?\nTej operacji nie można cofnąć.`}
        type="warning"
        confirmText="Usuń wszystkich"
        cancelText="Anuluj"
        onConfirm={confirmDeleteAll}
      />
    </div>
  );
};
