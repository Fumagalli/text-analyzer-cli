/**
 * Erro com código de sistema de arquivos (ENOENT, EACCES, etc.)
 * Usado para tratamento específico de erros de I/O
 */
interface ErroComCodigo extends Error {
  code?: string;
}

export default function trataErros(erro: ErroComCodigo): never {
  if (erro.code) {
    const erroMap: Record<string, string> = {
      ENOENT: 'Arquivo não encontrado',
      EACCES: 'Permissão negada para acessar o arquivo',
      EISDIR: 'Caminho especificado é um diretório, não um arquivo',
      ENOTDIR: 'Caminho de destino não é um diretório',
      EMFILE: 'Muitos arquivos abertos',
      ENOSPC: 'Espaço insuficiente no disco',
    };

    const mensagem = erroMap[erro.code] || `Erro: ${erro.message}`;
    const erro_customizado = new Error(mensagem);
    erro_customizado.stack = erro.stack; // Preserve stack
    throw erro_customizado;
  } else {
    // Re-throw non-fs errors (like validation errors) as is
    throw erro;
  }
}
