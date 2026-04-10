import fs from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProgram, validaEntrada } from '../cli.js';
import chalk from 'chalk';

describe('CLI', () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;
  let consoleLogMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve exibir erro quando texto ou destino não são fornecidos', async () => {
    const program = buildProgram();

    await program.parseAsync(['node', 'cli']);

    expect(consoleErrorMock).toHaveBeenCalledWith(
      chalk.red('erro: favor inserir caminho de origem e destino')
    );
  });

  describe('validaEntrada', () => {
    it('deve rejeitar extensão diferente de .txt', async () => {
      await expect(validaEntrada('origem.md', 'destino')).rejects.toThrow(
        'Arquivo precisa ter extensão .txt: origem.md'
      );
    });

    it('deve rejeitar arquivo inexistente', async () => {
      vi.spyOn(fs.promises, 'access').mockImplementation((path) => {
        if (path.toString().includes('origem.txt')) {
          return Promise.reject(new Error('ENOENT'));
        }
        return Promise.resolve();
      });

      await expect(validaEntrada('origem.txt', 'destino')).rejects.toThrow(
        'Arquivo não encontrado: origem.txt'
      );
    });

    it('deve rejeitar quando origem não é arquivo', async () => {
      vi.spyOn(fs.promises, 'access').mockResolvedValue();
      vi.spyOn(fs.promises, 'stat').mockImplementation((caminho) => {
        if (caminho.toString().includes('origem.txt')) {
          return Promise.resolve({
            isFile: () => false,
            isDirectory: () => false,
          } as unknown as fs.Stats);
        }
        return Promise.resolve({
          isFile: () => true,
          isDirectory: () => true,
        } as unknown as fs.Stats);
      });

      await expect(validaEntrada('origem.txt', 'destino')).rejects.toThrow(
        'Não é um arquivo: origem.txt'
      );
    });

    it('deve rejeitar diretório de destino inexistente', async () => {
      vi.spyOn(fs.promises, 'access').mockImplementation((path) => {
        if (path.toString().includes('destino')) {
          return Promise.reject(new Error('ENOENT'));
        }
        return Promise.resolve();
      });
      vi.spyOn(fs.promises, 'stat').mockResolvedValue({
        isFile: () => true,
        isDirectory: () => true,
      } as unknown as fs.Stats);

      await expect(validaEntrada('origem.txt', 'destino')).rejects.toThrow(
        'Diretório não existe: destino'
      );
    });

    it('deve rejeitar destino que não é diretório', async () => {
      vi.spyOn(fs.promises, 'access').mockResolvedValue();
      vi.spyOn(fs.promises, 'stat').mockImplementation((caminho) => {
        if (caminho.toString().includes('origem.txt')) {
          return Promise.resolve({
            isFile: () => true,
            isDirectory: () => false,
          } as unknown as fs.Stats);
        }
        return Promise.resolve({
          isFile: () => false,
          isDirectory: () => false,
        } as unknown as fs.Stats);
      });

      await expect(validaEntrada('origem.txt', 'destino')).rejects.toThrow(
        'Não é um diretório: destino'
      );
    });
  });

  it('deve tratar caminho de texto inexistente', async () => {
    const program = buildProgram();

    vi.spyOn(fs.promises, 'access').mockImplementation((path) =>
      path.toString().includes('origem.txt')
        ? Promise.reject(new Error('ENOENT'))
        : Promise.resolve()
    );
    vi.spyOn(fs.promises, 'stat').mockResolvedValue({
      isFile: () => true,
      isDirectory: () => true,
    } as unknown as fs.Stats);

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.txt',
      '--destino',
      'destino',
    ]);

    expect(
      consoleLogMock.mock.calls.some(([message]: [string]) =>
        String(message).includes('Arquivo não encontrado')
      )
    ).toBe(true);
  });

  it('deve tratar caminho de texto com extensão incorreta', async () => {
    const program = buildProgram();

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.md',
      '--destino',
      'destino',
    ]);

    expect(
      consoleLogMock.mock.calls.some(([message]: [string]) =>
        String(message).includes('Arquivo precisa ter extensão .txt')
      )
    ).toBe(true);
  });

  it('deve tratar caminho de origem que não é arquivo', async () => {
    const program = buildProgram();

    vi.spyOn(fs.promises, 'access').mockResolvedValue();
    vi.spyOn(fs.promises, 'stat').mockImplementation((caminho) => {
      if (caminho.toString().includes('origem.txt')) {
        return Promise.resolve({
          isFile: () => false,
          isDirectory: () => false,
        } as unknown as fs.Stats);
      }
      return Promise.resolve({
        isFile: () => true,
        isDirectory: () => true,
      } as unknown as fs.Stats);
    });

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.txt',
      '--destino',
      'destino',
    ]);

    expect(
      consoleLogMock.mock.calls.some(([message]: [string]) =>
        String(message).includes('Não é um arquivo')
      )
    ).toBe(true);
  });

  it('deve tratar diretório de destino inexistente', async () => {
    const program = buildProgram();

    vi.spyOn(fs.promises, 'access').mockImplementation((path) =>
      path.toString().includes('destino')
        ? Promise.reject(new Error('ENOENT'))
        : Promise.resolve()
    );
    vi.spyOn(fs.promises, 'stat').mockResolvedValue({
      isFile: () => true,
      isDirectory: () => true,
    } as unknown as fs.Stats);

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.txt',
      '--destino',
      'destino',
    ]);

    expect(
      consoleLogMock.mock.calls.some(([message]: [string]) =>
        String(message).includes('Diretório não existe')
      )
    ).toBe(true);
  });

  it('deve tratar destino que não é diretório', async () => {
    const program = buildProgram();

    vi.spyOn(fs.promises, 'access').mockResolvedValue();
    vi.spyOn(fs.promises, 'stat').mockImplementation((caminho) => {
      if (caminho.toString().includes('origem.txt')) {
        return Promise.resolve({
          isFile: () => true,
          isDirectory: () => false,
        } as unknown as fs.Stats);
      }
      return Promise.resolve({
        isFile: () => false,
        isDirectory: () => false,
      } as unknown as fs.Stats);
    });

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.txt',
      '--destino',
      'destino',
    ]);

    expect(
      consoleLogMock.mock.calls.some(([message]: [string]) =>
        String(message).includes('Não é um diretório')
      )
    ).toBe(true);
  });

  it('deve processar com sucesso quando entradas são válidas', async () => {
    const program = buildProgram();

    vi.spyOn(fs.promises, 'access').mockResolvedValue();
    vi.spyOn(fs.promises, 'stat').mockImplementation((caminho) => {
      if (caminho.toString().includes('origem.txt')) {
        return Promise.resolve({
          isFile: () => true,
          isDirectory: () => false,
        } as unknown as fs.Stats);
      }
      return Promise.resolve({
        isFile: () => false,
        isDirectory: () => true,
      } as unknown as fs.Stats);
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('um dois dois');
    vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    await program.parseAsync([
      'node',
      'cli',
      '--texto',
      'origem.txt',
      '--destino',
      'destino',
    ]);

    expect(consoleLogMock).toHaveBeenCalledWith(
      chalk.green('texto processado com sucesso')
    );
    expect(
      consoleLogMock.mock.calls.some(
        ([message]: [string]) => message === 'arquivo criado'
      )
    ).toBe(true);
  });
});
