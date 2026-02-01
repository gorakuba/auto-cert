import { useEffect } from "react";

interface SnackbarProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Snackbar = ({
  message,
  type = "info",
  isOpen,
  onClose,
  duration = 3000,
}: SnackbarProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-orange-600",
    error: "bg-red-600",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-up">
      <div
        className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
      >
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
