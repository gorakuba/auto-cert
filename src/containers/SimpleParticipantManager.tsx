import { useState } from "react";
import { Modal } from "../components/Modal";
import { ParticipantEmptyState } from "../components/ParticipantManager/ParticipantEmptyState";
import { ParticipantHeader } from "../components/ParticipantManager/ParticipantHeader";
import { ParticipantRow } from "../components/ParticipantManager/ParticipantRow";
import { ParticipantToolbar } from "../components/ParticipantManager/ParticipantToolbar";

interface Participant {
  id: string;
  name: string;
  email?: string;
  company?: string;
  score?: number;
  completionDate?: string;
}

interface SimpleParticipantManagerProps {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
  onClose: () => void;
  onImportMore?: () => void;
  onDelete?: (participantName: string) => void;
}

export const SimpleParticipantManager = ({
  participants,
  onUpdate,
  onClose,
  onImportMore,
  onDelete,
}: SimpleParticipantManagerProps) => {
  const [search, setSearch] = useState("");
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

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id);
  };

  const handleSave = (participant: Participant) => {
    const updated = participants.map((p) =>
      p.id === participant.id ? participant : p,
    );
    onUpdate(updated);
    setEditingId(null);
    showAlert(
      "Zapisano zmiany",
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

  const handleAdd = () => {
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: "Nowy Uczestnik",
    };
    onUpdate([...participants, newParticipant]);
    showAlert(
      "Dodano uczestnika",
      "Nowy uczestnik został dodany do listy. Możesz teraz edytować jego dane.",
      "success",
    );
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[80] p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col ring-1 ring-black/5 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <ParticipantHeader count={participants.length} onClose={onClose} />

        {/* Toolbar */}
        <ParticipantToolbar
          search={search}
          onSearchChange={setSearch}
          onAdd={handleAdd}
          onDeleteAll={handleDeleteAll}
          onImportMore={onImportMore}
          stats={{
            total: participants.length,
            filtered: filteredParticipants.length,
          }}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredParticipants.length === 0 ? (
            <ParticipantEmptyState search={search} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Imię i Nazwisko
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Firma
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Wynik
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Data
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
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
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Wyświetlono {filteredParticipants.length} z {participants.length}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Zamknij
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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

      {/* Alert Modal */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Delete All Confirmation Modal */}
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
