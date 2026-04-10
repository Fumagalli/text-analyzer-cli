import { describe, it, expect } from 'vitest';
import { contaPalavras } from '../index.js';
import { montaSaidaArquivo } from '../helpers.js';

describe('contaPalavras', () => {
  it('deve contar palavras por parágrafo', () => {
    const texto = `Este é um parágrafo de teste.
Este parágrafo tem palavras repetidas.`;

    const resultado = contaPalavras(texto);

    expect(resultado).toEqual([
      { este: 1, parágrafo: 1, teste: 1 },
      { este: 1, parágrafo: 1, tem: 1, palavras: 1, repetidas: 1 },
    ]);
  });

  it('deve ignorar palavras com menos de 3 caracteres', () => {
    const texto = 'um dois três um';

    const resultado = contaPalavras(texto);

    expect(resultado[0]).toHaveProperty('dois', 1);
    expect(resultado[0]).toHaveProperty('três', 1);
    expect(resultado[0]).not.toHaveProperty('um');
  });

  it('deve respeitar minChars customizado', () => {
    const texto = 'um dois três um';

    const resultado = contaPalavras(texto, 4);

    expect(resultado[0]).toHaveProperty('dois', 1);
    expect(resultado[0]).toHaveProperty('três', 1);
    expect(resultado[0]).not.toHaveProperty('um');
  });
});

describe('montaSaidaArquivo', () => {
  it('deve montar saída com palavras duplicadas', () => {
    const listaPalavras: Record<string, number>[] = [
      { palavra: 2, outra: 1 },
      { teste: 3, exemplo: 1 },
    ];

    const resultado = montaSaidaArquivo(listaPalavras);

    expect(resultado).toBe(
      'palavras duplicadas no parágrafo 1: palavra\npalavras duplicadas no parágrafo 2: teste\n'
    );
  });

  it('deve ignorar parágrafos sem duplicatas', () => {
    const listaPalavras: Record<string, number>[] = [
      { palavra: 1, outra: 1 },
      { teste: 2 },
    ];

    const resultado = montaSaidaArquivo(listaPalavras);

    expect(resultado).toBe('palavras duplicadas no parágrafo 2: teste\n');
  });

  it('deve respeitar minCount customizado', () => {
    const listaPalavras: Record<string, number>[] = [
      { palavra: 2, outra: 1 },
      { teste: 3, exemplo: 1 },
    ];

    const resultado = montaSaidaArquivo(listaPalavras, 3);

    expect(resultado).toBe('palavras duplicadas no parágrafo 2: teste\n');
  });
});
