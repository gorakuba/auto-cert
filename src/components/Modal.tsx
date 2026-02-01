interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-500">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
        );
      case "warning":
        return (
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-500">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-yellow-400 rounded-full mx-auto animate-pulse opacity-20"></div>
          </div>
        );
      case "error":
        return (
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-500">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-red-400 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-500">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-blue-400 rounded-full mx-auto animate-pulse opacity-20"></div>
          </div>
        );
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          gradient: "from-green-50 via-green-50 to-emerald-50",
          border: "border-green-200",
          button:
            "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
          text: "text-green-900",
          accent: "bg-green-500",
        };
      case "warning":
        return {
          gradient: "from-yellow-50 via-orange-50 to-yellow-50",
          border: "border-yellow-300",
          button:
            "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
          text: "text-yellow-900",
          accent: "bg-yellow-500",
        };
      case "error":
        return {
          gradient: "from-red-50 via-red-50 to-pink-50",
          border: "border-red-200",
          button:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
          text: "text-red-900",
          accent: "bg-red-500",
        };
      default:
        return {
          gradient: "from-blue-50 via-indigo-50 to-blue-50",
          border: "border-blue-200",
          button:
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
          text: "text-blue-900",
          accent: "bg-blue-500",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top accent bar */}
        <div className={`h-2 ${colors.accent}`}></div>

        {/* Header with gradient background */}
        <div
          className={`bg-gradient-to-br ${colors.gradient} p-8 border-b ${colors.border}`}
        >
          {getIcon()}
          <h2 className={`text-2xl font-bold text-center ${colors.text} mb-1`}>
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-8 bg-white">
          <p className="text-gray-700 text-center leading-relaxed whitespace-pre-line text-base">
            {message}
          </p>
        </div>

        {/* Footer with buttons */}
        <div className="p-6 bg-gray-50 flex gap-3">
          {cancelText && (
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3.5 ${colors.button} text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
