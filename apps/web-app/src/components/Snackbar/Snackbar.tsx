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
  duration = 4000,
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

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white/90 border-green-200",
          icon: (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ),
        };
      case "warning":
        return {
          bg: "bg-white/90 border-amber-200",
          icon: (
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          ),
        };
      case "error":
        return {
          bg: "bg-white/90 border-red-200",
          icon: (
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ),
        };
      default:
        return {
          bg: "bg-white/90 border-gray-200",
          icon: (
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ),
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className="fixed bottom-6 left-6 z-[120] animate-slide-up"
      role="alert"
    >
      <div
        className={`backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 min-w-[300px] max-w-sm ${theme.bg} transform transition-all hover:scale-[1.01]`}
      >
        {theme.icon}
        <p className="flex-1 text-gray-700 font-medium text-sm leading-tight">
          {message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
