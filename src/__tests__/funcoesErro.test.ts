import { describe, expect, it } from 'vitest';
import trataErros from '../erros/funcoesErro.js';

describe('trataErros', () => {
  it.each([
    ['ENOENT', 'Arquivo não encontrado'],
    ['EACCES', 'Permissão negada para acessar o arquivo'],
    ['EISDIR', 'Caminho especificado é um diretório, não um arquivo'],
    ['ENOTDIR', 'Caminho de destino não é um diretório'],
    ['EMFILE', 'Muitos arquivos abertos'],
    ['ENOSPC', 'Espaço insuficiente no disco'],
  ])('mapeia %s para mensagem amigável', (code, expected) => {
    const erro = new Error('erro de teste') as Error & { code?: string };
    erro.code = code;

    expect(() => trataErros(erro)).toThrow(expected);
  });

  it('repassa erro sem código', () => {
    const erro = new Error('erro desconhecido');

    expect(() => trataErros(erro)).toThrow('erro desconhecido');
  });

  it('trata erro com código desconhecido usando fallback', () => {
    const erro = new Error('erro customizado') as Error & { code?: string };
    erro.code = 'UNKNOWN_CODE';

    expect(() => trataErros(erro)).toThrow('Erro: erro customizado');
  });

  it('preserva stack trace do erro original', () => {
    const erro = new Error('erro de teste') as Error & { code?: string };
    erro.code = 'ENOENT';
    const originalStack = erro.stack;

    try {
      trataErros(erro);
    } catch (caught) {
      expect((caught as Error).stack).toBe(originalStack);
    }
  });
});
