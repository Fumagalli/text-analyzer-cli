/**
 * Conta palavras duplicadas em cada parágrafo do texto fornecido.
 */
export function contaPalavras(
  texto: string,
  minChars: number = 3
): Record<string, number>[] {
  const paragrafos = extraiParagrafos(texto);
  const contagem = paragrafos.flatMap((paragrafo): Record<string, number>[] => {
    if (!paragrafo) return [];

    return [verificaPalavrasDuplicadas(paragrafo, minChars)];
  });

  return contagem;
}

/**
 * Extrai parágrafos do texto, dividindo por quebras de linha e convertendo para minúsculas.
 */
export function extraiParagrafos(texto: string): string[] {
  return texto
    .toLowerCase()
    .split(/\r?\n/)
    .filter((paragrafo) => paragrafo.trim() !== '');
}

/**
 * Remove caracteres especiais/pontuação da palavra.
 */
function limpaPalavras(palavra: string): string {
  const regex =
    /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\\\u2014\u2013\u2026\u201C\u201D\u2018\u2019]/g;
  return palavra.replace(regex, '');
}

/**
 * Verifica e conta ocorrências de palavras em um texto, ignorando palavras < minChars caracteres.
 */
function verificaPalavrasDuplicadas(
  texto: string,
  minChars: number
): Record<string, number> {
  const listaPalavras = texto.split(/\s+/);
  const resultado: Record<string, number> = {};

  listaPalavras.forEach((palavra) => {
    const palavraLimpa = limpaPalavras(palavra);
    if (!palavraLimpa) return;
    if (palavraLimpa.length < minChars) return;

    resultado[palavraLimpa] = (resultado[palavraLimpa] || 0) + 1;
  });

  return resultado;
}
