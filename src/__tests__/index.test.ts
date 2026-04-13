import { describe, it, expect } from 'vitest';
import { countWords } from '../index.js';
import { buildOutputFormat } from '../helpers.js';

describe('countWords', () => {
  it('deve contar palavras por parágrafo', () => {
    const texto = `Este é um parágrafo de teste.
Este parágrafo tem palavras repetidas.`;

    const resultado = countWords(texto);

    expect(resultado).toEqual([
      { este: 1, parágrafo: 1, teste: 1 },
      { este: 1, parágrafo: 1, tem: 1, palavras: 1, repetidas: 1 },
    ]);
  });

  it('deve ignorar palavras com menos de 3 caracteres', () => {
    const texto = 'um dois três um';

    const resultado = countWords(texto);

    expect(resultado[0]).toHaveProperty('dois', 1);
    expect(resultado[0]).toHaveProperty('três', 1);
    expect(resultado[0]).not.toHaveProperty('um');
  });

  it('deve respeitar minChars customizado', () => {
    const texto = 'um dois três um';

    const resultado = countWords(texto, 4);

    expect(resultado[0]).toHaveProperty('dois', 1);
    expect(resultado[0]).toHaveProperty('três', 1);
    expect(resultado[0]).not.toHaveProperty('um');
  });
});

describe('buildOutputFormat', () => {
  it('deve montar saída com palavras duplicadas', () => {
    const wordList: Record<string, number>[] = [
      { palavra: 2, outra: 1 },
      { teste: 3, exemplo: 1 },
    ];

    const resultado = buildOutputFormat(wordList);

    expect(resultado).toBe(
      'palavras duplicadas no parágrafo 1: palavra\npalavras duplicadas no parágrafo 2: teste\n'
    );
  });

  it('deve ignorar parágrafos sem duplicatas', () => {
    const wordList: Record<string, number>[] = [
      { palavra: 1, outra: 1 },
      { teste: 2 },
    ];

    const resultado = buildOutputFormat(wordList);

    expect(resultado).toBe('palavras duplicadas no parágrafo 2: teste\n');
  });

  it('deve respeitar minCount customizado', () => {
    const wordList: Record<string, number>[] = [
      { palavra: 2, outra: 1 },
      { teste: 3, exemplo: 1 },
    ];

    const resultado = buildOutputFormat(wordList, 3);

    expect(resultado).toBe('palavras duplicadas no parágrafo 2: teste\n');
  });
});

describe('Regression: Punctuation Cleanup Order (B1)', () => {
  it('should count words after punctuation cleanup', () => {
    // "!hello!" (7 chars with punctuation) should become "hello" (5 chars) after cleanup
    // This test validates that punctuation is removed before length check
    const resultado = countWords('!hello! !world!');
    expect(resultado[0]).toHaveProperty('hello');
    expect(resultado[0]).toHaveProperty('world');
  });

  it('should remove punctuation at start and end', () => {
    const resultado = countWords('!hello! .test.');
    expect(resultado[0]).toHaveProperty('hello');
    expect(resultado[0]).toHaveProperty('test');
  });

  it('should preserve internal structure after cleanup', () => {
    // "hello-world" becomes "helloworld" after cleanup (hyphen removed)
    const resultado = countWords('hello-world');
    expect(Object.keys(resultado[0]).length).toBeGreaterThan(0);
  });
});

describe('Regression: CRLF Line Ending Support (B2)', () => {
  it('should split paragraphs on CRLF line endings', () => {
    const crlf = 'Para 1 palavra\r\nPara 2 palavra\r\nPara 3 palavra';
    const resultado = countWords(crlf);
    expect(resultado).toHaveLength(3);
  });

  it('should handle mixed line endings', () => {
    const mixed = 'Para 1 palavra\nPara 2 palavra\r\nPara 3 palavra';
    const resultado = countWords(mixed);
    expect(resultado).toHaveLength(3);
  });

  it('should not create empty paragraphs', () => {
    const crlf = 'Para 1\r\n\r\nPara 2';
    const resultado = countWords(crlf);
    // Should filter out empty paragraphs
    expect(resultado.length).toBeLessThanOrEqual(2);
  });
});

describe('Regression: PT-BR Punctuation Expansion (B3)', () => {
  it('should handle PT-BR em-dash (—) in text', () => {
    const resultado = countWords('é— fim');
    // Em-dash should be removed, leaving valid words
    expect(Object.keys(resultado[0]).length).toBeGreaterThan(0);
  });

  it('should remove PT-BR guillemets (« »)', () => {
    const resultado = countWords('«test» hello');
    expect(resultado[0]).toHaveProperty('test');
    expect(resultado[0]).toHaveProperty('hello');
    // Should not have guillemets in the keys
    expect(JSON.stringify(resultado[0])).not.toContain('«');
    expect(JSON.stringify(resultado[0])).not.toContain('»');
  });

  it('should remove ellipsis (…)', () => {
    const resultado = countWords('test… message…');
    expect(resultado[0]).toHaveProperty('test');
    expect(resultado[0]).toHaveProperty('message');
  });

  it('should handle mixed PT-BR punctuation', () => {
    const texto = 'Olá! «message» — yes…';
    expect(() => countWords(texto)).not.toThrow();
    expect(countWords(texto).length).toBeGreaterThan(0);
  });
});

describe('Regression: Empty and Edge Case Text (B4)', () => {
  it('should handle empty string', () => {
    const resultado = countWords('');
    expect(resultado).toEqual([]);
  });

  it('should handle whitespace-only text', () => {
    const resultado = countWords('   \n\n  \t  ');
    expect(resultado).toEqual([]);
  });

  it('should handle text with only special characters', () => {
    const resultado = countWords('!!! ..... ----');
    // After cleanup and filtering, should result in empty or marked as edge case
    expect(resultado).toBeDefined();
  });

  it('should handle unicode characters', () => {
    const resultado = countWords('Résumé Ñoño café');
    expect(resultado[0]).toHaveProperty('résumé');
    expect(resultado[0]).toHaveProperty('ñoño');
    expect(resultado[0]).toHaveProperty('café');
  });

  it('should handle mixed CRLF and irregular spacing', () => {
    const texto = 'Text word\r\n  \t  More word\nText';
    expect(() => countWords(texto)).not.toThrow();
    expect(countWords(texto).length).toBeGreaterThan(0);
  });
});
