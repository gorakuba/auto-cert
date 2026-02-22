/**
 * Parses a CSV string into a 2D array of strings.
 * Handles basic CSV features like quoted fields and commas within quotes.
 *
 * @param text The raw CSV string content
 * @returns A 2D array where each inner array represents a row and contains cell values
 */
export const parseCSV = (text: string): string[][] => {
  const lines = text.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    // Simple CSV parser (handles basic cases)
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
};
