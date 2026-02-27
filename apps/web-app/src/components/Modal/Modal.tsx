import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
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
  children,
  maxWidth = "max-w-sm",
}: ModalProps & { children?: React.ReactNode; maxWidth?: string }) {
  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          icon: (
            <svg
              className="w-6 h-6"
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
          ),
          button: "bg-green-600 hover:bg-green-700 ring-green-200",
        };
      case "warning":
        return {
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          icon: (
            <svg
              className="w-6 h-6"
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
          ),
          button: "bg-amber-600 hover:bg-amber-700 ring-amber-200",
        };
      case "error":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          icon: (
            <svg
              className="w-6 h-6"
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
          ),
          button: "bg-red-600 hover:bg-red-700 ring-red-200",
        };
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: (
            <svg
              className="w-6 h-6"
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
          ),
          button: "bg-blue-600 hover:bg-blue-700 ring-blue-200",
        };
    }
  };

  const theme = getTheme();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    // Only close if no onConfirm (or if we want explicit close control, but typically confirm closes)
    // However, existing usage implies close on confirm? No, existing usage: confirmDelete calls onClose internally if needed or just deletes.
    // Wait, Check App.tsx or ParticipantsPage usage. `handleDelete` -> `setDeleteModal`. `confirmDelete` -> delete and `setDeleteModal(false)`.
    // BUT the Modal logic in line 79 closes it: `onClose()`.
    // If we want manual control (e.g. form validation fail), we shouldn't auto close.
    // But for now let's stick to existing behavior unless manual add needs change.
    // Manual add logic in ParticipantsPage: `confirmManualAdd` calls `setManualAddOpen(false)`.
    // If Modal auto-closes on onConfirm, then it might be redundant or conflict.
    // Let's modify handleConfirm to NOT call onClose if onConfirm is present, assuming onConfirm handles it?
    // Or just leave it as is. Existing: `handleConfirm` -> `if(onConfirm) onConfirm(); onClose();`.
    // If I want to validate form, I might not want to close.
    // But for simplistic approach:
    // If onConfirm is passed, it does logic. Then Modal closes.
    // For Manual Add, I pass `onConfirm` which validates. If validation fails, it shows snackbar/returns.
    // If it returns, Modal still closes if I keep `onClose()`.
    if (shouldAutoClose) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const shouldAutoClose = true;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      style={{ animationFillMode: "both" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all animate-in zoom-in duration-300 overflow-hidden ring-1 ring-black/5`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 leading-6">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Zamknij"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-5">
            {/* Show icon only if it's an alert-style message without complex children, or if explicitly desired. 
                For cleanliness, let's show Icon + Message at top if message exists. */}
            {(message && type !== "info") || (message && type === "info") ? (
              <div className="flex items-center gap-4">
                {type !== "info" && (
                  <div
                    className={`p-3 rounded-full h-fit w-fit flex-shrink-0 ${theme.iconBg} ${theme.iconColor}`}
                  >
                    {theme.icon}
                  </div>
                )}
                {message && (
                  <p className="text-sm text-gray-500 leading-relaxed text-balance">
                    {message}
                  </p>
                )}
              </div>
            ) : null}

            {children && <div className="w-full">{children}</div>}
          </div>
        </div>

        {/* Footer */}
        {(cancelText || onConfirm) && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white rounded-lg text-sm font-medium transition-all shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 ${theme.button}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
