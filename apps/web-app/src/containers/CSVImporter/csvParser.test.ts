import { describe, it, expect } from "vitest";
import { parseCSV } from "./csvParser";

describe("parseCSV", () => {
  it("should parse simple comma-separated values", () => {
    const input = "name,email,score\nJohn,john@example.com,90";
    const expected = [
      ["name", "email", "score"],
      ["John", "john@example.com", "90"],
    ];
    expect(parseCSV(input)).toEqual(expected);
  });

  it("should handle quoted values with commas", () => {
    const input = 'name,company\n"Smith, John",Acme Corp';
    const expected = [
      ["name", "company"],
      ["Smith, John", "Acme Corp"],
    ];
    expect(parseCSV(input)).toEqual(expected);
  });

  it("should trim whitespace around values (but keep inside quotes logic is currently strict on the implementation)", () => {
    // The current implementation trims each value after parsing.
    const input = "a, b , c \n 1 , 2 , 3 ";
    // Based on the code: current.trim() is called on push.
    const expected = [
      ["a", "b", "c"],
      ["1", "2", "3"],
    ];
    expect(parseCSV(input)).toEqual(expected);
  });

  it("should ignore empty lines", () => {
    const input = "a,b\n\n1,2\n";
    const expected = [
      ["a", "b"],
      ["1", "2"],
    ];
    expect(parseCSV(input)).toEqual(expected);
  });

  it("should handle empty input", () => {
    expect(parseCSV("")).toEqual([]);
  });
});
