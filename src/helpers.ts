/**
 * Filtra palavras que aparecem mais de minCount vezes no parágrafo.
 */
function filtraOcorrencias(
  paragrafo: Record<string, number>,
  minCount: number = 2
): string[] {
  return Object.keys(paragrafo).filter((chave) => paragrafo[chave] >= minCount);
}

/**
 * Monta a saída do arquivo com palavras duplicadas por parágrafo.
 */
function montaSaidaArquivo(
  listaPalavras: Record<string, number>[],
  minCount: number = 2
): string {
  const linhas = listaPalavras
    .map((paragrafo, index) => {
      const duplicadas = filtraOcorrencias(paragrafo, minCount).join(', ');
      if (!duplicadas) return null;
      return `palavras duplicadas no parágrafo ${index + 1}: ${duplicadas}`;
    })
    .filter((linha): linha is string => linha !== null);

  return linhas.length > 0 ? linhas.join('\n') + '\n' : '';
}

export { montaSaidaArquivo };
