import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "../../utils/test-utils";
import { Snackbar } from "./Snackbar";

describe("Snackbar Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const defaultProps = {
    isOpen: true,
    message: "Test notification",
    type: "success" as const,
    onClose: vi.fn(),
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = renderWithProviders(
      <Snackbar {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders message when isOpen is true", () => {
    renderWithProviders(<Snackbar {...defaultProps} />);
    expect(screen.getByText("Test notification")).toBeInTheDocument();
  });

  describe("Type variants", () => {
    it("renders success type with checkmark icon", () => {
      renderWithProviders(<Snackbar {...defaultProps} type="success" />);
      const snackbar = screen.getByRole("alert").firstChild;
      expect(snackbar).toHaveClass("border-green-200");
    });

    it("renders info type with info icon", () => {
      renderWithProviders(<Snackbar {...defaultProps} type="info" />);
      const snackbar = screen.getByRole("alert").firstChild;
      expect(snackbar).toHaveClass("border-gray-200");
    });

    it("renders warning type with warning styling", () => {
      renderWithProviders(<Snackbar {...defaultProps} type="warning" />);
      const snackbar = screen.getByRole("alert").firstChild;
      expect(snackbar).toHaveClass("border-amber-200");
    });

    it("renders error type with error styling", () => {
      renderWithProviders(<Snackbar {...defaultProps} type="error" />);
      const snackbar = screen.getByRole("alert").firstChild;
      expect(snackbar).toHaveClass("border-red-200");
    });
  });

  // ... auto close ...

  // ... manual close ...

  describe("Positioning", () => {
    it("is positioned at bottom-left of screen", () => {
      renderWithProviders(<Snackbar {...defaultProps} />);
      const snackbar = screen.getByRole("alert");
      expect(snackbar).toHaveClass("fixed");
      expect(snackbar).toHaveClass("bottom-6");
      expect(snackbar).toHaveClass("left-6");
    });

    it("has high z-index for visibility", () => {
      renderWithProviders(<Snackbar {...defaultProps} />);
      const snackbar = screen.getByRole("alert");
      expect(snackbar).toHaveClass("z-[120]");
    });
  });

  describe("Animations", () => {
    it("has slide-in animation classes", () => {
      renderWithProviders(<Snackbar {...defaultProps} />);
      const snackbar = screen.getByRole("alert");
      expect(snackbar).toHaveClass("animate-slide-up");
    });
  });

  describe("Accessibility", () => {
    it("has appropriate role", () => {
      renderWithProviders(<Snackbar {...defaultProps} />);
      const snackbar = screen.getByRole("alert");
      expect(snackbar).toBeInTheDocument();
      expect(snackbar).toHaveAttribute("role", "alert");
    });
  });
});
