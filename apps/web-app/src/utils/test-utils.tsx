import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import type { Participant, TemplateInfo } from "../types";

// Custom render function (can be extended with providers later)
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { ...options });
}

// Mock data generators
export const mockParticipant = (
  overrides?: Partial<Participant>,
): Participant => ({
  id: "p-1",
  name: "Jan Kowalski",
  email: "jan@example.com",
  company: "Test Firma",
  score: 95,
  completionDate: "2024-01-15",
  ...overrides,
});

export const mockTemplate = (
  overrides?: Partial<TemplateInfo>,
): TemplateInfo => ({
  id: "t-1",
  name: "Test Template",
  thumbnail: "/test-thumb.svg",
  path: "/test-template.svg",
  description: "Test description",
  category: "education",
  isCustom: false,
  ...overrides,
});

export const mockParticipants = (count: number): Participant[] =>
  Array.from({ length: count }, (_, i) =>
    mockParticipant({
      id: `p-${i + 1}`,
      name: `Uczestnik ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }),
  );

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
