/**
 * Word count per paragraph: word -> number of occurrences
 */
export interface WordCountMap {
  [word: string]: number;
}

/**
 * Counts duplicate words in each paragraph of the provided text.
 */
export function countWords(text: string, minChars: number = 3): WordCountMap[] {
  const paragraphs = extractParagraphs(text);
  const count = paragraphs.flatMap((paragraph): WordCountMap[] => {
    if (!paragraph) return [];

    return [analyzeWordFrequency(paragraph, minChars)];
  });

  return count;
}

/**
 * Extracts paragraphs from the text, splitting by line breaks and converting to lowercase.
 */
export function extractParagraphs(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\r?\n/)
    .filter((paragraph) => paragraph.trim() !== '');
}

/**
 * Removes special characters and punctuation from a word.
 */
function cleanWord(word: string): string {
  const regex =
    /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\\\u2014\u2013\u2026\u201C\u201D\u2018\u2019\u00AB\u00BB?]/g;
  return word.replace(regex, '');
}

/**
 * Checks and counts word occurrences in a text, ignoring words < minChars characters.
 */
function analyzeWordFrequency(text: string, minChars: number): WordCountMap {
  const wordList = text.split(/\s+/);
  const result: WordCountMap = {};

  wordList.forEach((word) => {
    const cleanedWord = cleanWord(word);
    if (!cleanedWord) return;
    if (cleanedWord.length < minChars) return;

    result[cleanedWord] = (result[cleanedWord] || 0) + 1;
  });

  return result;
}
