import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "../test/utils/test-utils";
import { Modal } from "./Modal";
import userEvent from "@testing-library/user-event";

describe("Modal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    message: "This is a test message",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = renderWithProviders(
      <Modal {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal content when isOpen is true", () => {
    renderWithProviders(<Modal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("This is a test message")).toBeInTheDocument();
  });

  it("renders to document.body using portal", () => {
    renderWithProviders(<Modal {...defaultProps} />);
    const modalBackdrop = document.querySelector(".fixed.inset-0");
    expect(modalBackdrop?.parentElement).toBe(document.body);
  });

  describe("Type variants", () => {
    it("renders success type with green styling", () => {
      renderWithProviders(<Modal {...defaultProps} type="success" />);
      const icon = document.querySelector(".bg-green-100");
      expect(icon).toBeInTheDocument();
    });

    it("renders warning type with amber styling", () => {
      renderWithProviders(<Modal {...defaultProps} type="warning" />);
      const icon = document.querySelector(".bg-amber-100");
      expect(icon).toBeInTheDocument();
    });

    it("renders error type with red styling", () => {
      renderWithProviders(<Modal {...defaultProps} type="error" />);
      const icon = document.querySelector(".bg-red-100");
      expect(icon).toBeInTheDocument();
    });

    it("renders info type by default", () => {
      renderWithProviders(<Modal {...defaultProps} />);
      const icon = document.querySelector(".bg-blue-100");
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe("User interactions", () => {
    it("calls onClose when clicking backdrop", async () => {
      const onClose = vi.fn();
      renderWithProviders(<Modal {...defaultProps} onClose={onClose} />);

      const backdrop = document.querySelector(".fixed.inset-0");
      await userEvent.click(backdrop!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when clicking modal content", async () => {
      const onClose = vi.fn();
      renderWithProviders(<Modal {...defaultProps} onClose={onClose} />);

      const modalContent = screen.getByText("Test Modal").closest(".bg-white");
      await userEvent.click(modalContent!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when clicking default OK button", async () => {
      const onClose = vi.fn();
      renderWithProviders(
        <Modal {...defaultProps} onClose={onClose} onConfirm={vi.fn()} />,
      );

      const okButton = screen.getByText("OK");
      await userEvent.click(okButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm and onClose when confirmation button clicked", async () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      renderWithProviders(
        <Modal
          {...defaultProps}
          onClose={onClose}
          onConfirm={onConfirm}
          confirmText="Potwierdź"
          cancelText="Anuluj"
        />,
      );

      const confirmButton = screen.getByText("Potwierdź");
      await userEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls only onClose when cancel button clicked", async () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      renderWithProviders(
        <Modal
          {...defaultProps}
          onClose={onClose}
          onConfirm={onConfirm}
          confirmText="Potwierdź"
          cancelText="Anuluj"
        />,
      );

      const cancelButton = screen.getByText("Anuluj");
      await userEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("renders custom button text", () => {
      renderWithProviders(
        <Modal
          {...defaultProps}
          confirmText="Usuń"
          cancelText="Cofnij"
          onConfirm={vi.fn()}
        />,
      );

      expect(screen.getByText("Usuń")).toBeInTheDocument();
      expect(screen.getByText("Cofnij")).toBeInTheDocument();
    });

    it("shows only confirm button when no cancelText provided", () => {
      renderWithProviders(
        <Modal {...defaultProps} confirmText="OK" onConfirm={vi.fn()} />,
      );

      expect(screen.getByText("OK")).toBeInTheDocument();
      expect(screen.queryByText("Anuluj")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      renderWithProviders(<Modal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Styling and animations", () => {
    it("has backdrop blur effect", () => {
      renderWithProviders(<Modal {...defaultProps} />);

      const backdrop = document.querySelector(".backdrop-blur-sm");
      expect(backdrop).toBeInTheDocument();
    });

    it("has high z-index for proper stacking", () => {
      renderWithProviders(<Modal {...defaultProps} />);

      const backdrop = document.querySelector(".z-\\[5000\\]");
      expect(backdrop).toBeInTheDocument();
    });
  });
});
