/**
 * Filters words that appear more than minCount times in the paragraph.
 */
function filterOccurrences(
  paragraph: Record<string, number>,
  minCount: number = 2
): string[] {
  return Object.keys(paragraph).filter((key) => paragraph[key] >= minCount);
}

/**
 * Builds the output file with duplicate words per paragraph.
 */
function buildOutputFormat(
  wordList: Record<string, number>[],
  minCount: number = 2
): string {
  const lines = wordList
    .map((paragraph, index) => {
      const repeated = filterOccurrences(paragraph, minCount).join(', ');
      if (!repeated) return null;
      return `palavras duplicadas no parágrafo ${index + 1}: ${repeated}`;
    })
    .filter((line): line is string => line !== null);

  return lines.length > 0 ? lines.join('\n') + '\n' : '';
}

export { buildOutputFormat };
