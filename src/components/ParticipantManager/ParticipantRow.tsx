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
                <td className="py-3 px-4">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </td>
                <td className="py-3 px-4">
                    <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </td>
                <td className="py-3 px-4">
                    <input
                        type="text"
                        value={formData.company || ""}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </td>
                <td className="py-3 px-4">
                    <input
                        type="date"
                        value={formData.completionDate || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, completionDate: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </td>
                <td className="py-3 px-4 text-right">
                    <button
                        onClick={handleSaveWrapper}
                        className="text-green-600 hover:text-green-700 mr-2"
                        title="Zapisz"
                    >
                        ✓
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="text-red-600 hover:text-red-700"
                        title="Anuluj"
                    >
                        ✗
                    </button>
                </td>
            </>
        );
    }

    return (
        <>
            <td className="py-3 px-4 font-medium text-gray-900">{participant.name}</td>
            <td className="py-3 px-4 text-gray-600">{participant.email || "-"}</td>
            <td className="py-3 px-4 text-gray-600">{participant.company || "-"}</td>
            <td className="py-3 px-4 text-gray-600">{participant.score || "-"}</td>
            <td className="py-3 px-4 text-gray-600">
                {participant.completionDate || "-"}
            </td>
            <td className="py-3 px-4 text-right">
                <button
                    onClick={() => {
                        setFormData(participant); // Reset form data to current participant state
                        onEditStart(participant);
                    }}
                    className="text-blue-600 hover:text-blue-700 mr-3"
                    title="Edytuj"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(participant)}
                    className="text-red-600 hover:text-red-700"
                    title="Usuń"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                </button>
            </td>
        </>
    );
};
