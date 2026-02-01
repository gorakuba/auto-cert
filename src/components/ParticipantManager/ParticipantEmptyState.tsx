interface ParticipantEmptyStateProps {
    search: string;
    onAdd: () => void;
}

export const ParticipantEmptyState = ({
    search,
    onAdd,
}: ParticipantEmptyStateProps) => {
    return (
        <div className="text-center py-12">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
            >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <p className="text-gray-600">
                {search ? "Nie znaleziono uczestników" : "Brak uczestników"}
            </p>
            {!search && (
                <button
                    onClick={onAdd}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Dodaj pierwszego uczestnika
                </button>
            )}
        </div>
    );
};
