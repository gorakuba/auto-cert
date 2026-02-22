import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  email?: string;
  company?: string;
  score?: number;
  completionDate?: string;
}

interface ParticipantRowProps {
  participant: Participant;
  isEditing: boolean;
  onEditStart: (participant: Participant) => void;
  onSave: (updatedParticipant: Participant) => void;
  onCancelEdit: () => void;
  onDelete: (participant: Participant) => void;
}

export const ParticipantRow = ({
  participant,
  isEditing,
  onEditStart,
  onSave,
  onCancelEdit,
  onDelete,
}: ParticipantRowProps) => {
  const [formData, setFormData] = useState<Participant>(participant);

  // Update local state if the participant prop changes and we are not editing
  // or if we just started editing
  if (isEditing && formData.id !== participant.id) {
    setFormData(participant);
  }

  const handleSaveWrapper = () => {
    onSave(formData);
  };

  if (isEditing) {
    return (
      <>
        <td className="py-3 px-4 pl-6">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-indigo-50/50 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
            placeholder="Imię i nazwisko"
            autoFocus
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-50/50 border-0 rounded-lg text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
            placeholder="Email"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="text"
            value={formData.company || ""}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-50/50 border-0 rounded-lg text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
            placeholder="Firma"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="number"
            value={formData.score || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                score: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-20 px-3 py-2 bg-gray-50/50 border-0 rounded-lg text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
            placeholder="%"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="date"
            value={formData.completionDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, completionDate: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-50/50 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
          />
        </td>
        <td className="py-3 px-4 pr-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSaveWrapper}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all transform hover:scale-105"
              title="Zapisz"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all transform hover:scale-105"
              title="Anuluj"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </td>
      </>
    );
  }

  return (
    <>
      <td className="py-3 px-4 pl-6">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3">
            {participant.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{participant.name}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {participant.email || "-"}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {participant.company || "-"}
      </td>
      <td className="py-3 px-4">
        {participant.score !== undefined ? (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              participant.score >= 80
                ? "bg-green-100 text-green-800"
                : participant.score >= 50
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {participant.score}%
          </span>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {participant.completionDate || "-"}
      </td>
      <td className="py-3 px-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => {
              setFormData(participant);
              onEditStart(participant);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all transform hover:scale-105"
            title="Edytuj"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(participant)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-105"
            title="Usuń"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.1499.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149-.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </td>
    </>
  );
};
