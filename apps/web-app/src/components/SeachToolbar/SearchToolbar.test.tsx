import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchToolbar } from "./SearchToolbar";

describe("SearchToolbar", () => {
  it("renders input with placeholder", () => {
    render(
      <SearchToolbar
        value=""
        onChange={vi.fn()}
        placeholder="Search items..."
      />,
    );
    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
  });

  it("renders input with value", () => {
    render(<SearchToolbar value="Test query" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Test query")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchToolbar value="" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders children (action buttons)", () => {
    render(
      <SearchToolbar value="" onChange={vi.fn()}>
        <button>Action Button</button>
      </SearchToolbar>,
    );

    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });
});
