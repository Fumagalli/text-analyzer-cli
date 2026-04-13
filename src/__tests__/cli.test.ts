import fs from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProgram, validateInput, processFile } from '../cli.js';
import chalk from 'chalk';
import path from 'path';

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

  describe('validateInput', () => {
    it('deve rejeitar extensão diferente de .txt', async () => {
      await expect(validateInput('origem.md', 'destino')).rejects.toThrow(
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

      await expect(validateInput('origem.txt', 'destino')).rejects.toThrow(
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

      await expect(validateInput('origem.txt', 'destino')).rejects.toThrow(
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

      await expect(validateInput('origem.txt', 'destino')).rejects.toThrow(
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

      await expect(validateInput('origem.txt', 'destino')).rejects.toThrow(
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

describe('E2E: File Operations Pipeline', () => {
  let tempInputDir: string;
  let tempOutputDir: string;

  beforeEach(() => {
    tempInputDir = fs.mkdtempSync(path.join('/', 'tmp', 'e2e-input-'));
    tempOutputDir = fs.mkdtempSync(path.join('/', 'tmp', 'e2e-output-'));
  });

  afterEach(() => {
    // Cleanup temporary directories and files
    try {
      if (fs.existsSync(tempInputDir)) {
        fs.rmSync(tempInputDir, { recursive: true });
      }
      if (fs.existsSync(tempOutputDir)) {
        fs.rmSync(tempOutputDir, { recursive: true });
      }
    } catch {
      // Ignored
    }
  });

  it('should read file, process, and write results to disk', async () => {
    const inputFile = path.join(tempInputDir, 'test-input.txt');
    const inputContent = 'hello world\nhello test\nworld test test';

    // Setup: Create input file with known content
    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    // Execute: Process file with real file I/O (not mocked)
    await processFile(inputFile, tempOutputDir, 1, 2);

    // Verify: Output file exists
    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(outputFile)).toBe(true);

    // Verify: Output file has content with duplicate words
    const outputContent = fs.readFileSync(outputFile, 'utf-8');
    expect(outputContent).toBeTruthy();
    expect(outputContent).toContain('palavras duplicadas');
  });

  it('should handle multiple paragraphs correctly', async () => {
    const inputFile = path.join(tempInputDir, 'test-multi.txt');
    const inputContent =
      'Parágrafo um com palavras duplicadas palavras\nParágrafo dois com mais palavras duplicadas palavras';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    await processFile(inputFile, tempOutputDir, 2, 2);

    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(outputFile)).toBe(true);

    const outputContent = fs.readFileSync(outputFile, 'utf-8');
    expect(outputContent).toContain('palavras duplicadas no parágrafo');
  });

  it('should handle CRLF line endings in input file', async () => {
    const inputFile = path.join(tempInputDir, 'test-crlf.txt');
    const inputContent =
      'line one word word\r\nline two word word\r\nline three';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    await processFile(inputFile, tempOutputDir, 1, 2);

    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(outputFile)).toBe(true);

    const outputContent = fs.readFileSync(outputFile, 'utf-8');
    expect(outputContent).toBeTruthy();
  });

  it('should handle empty file gracefully', async () => {
    const inputFile = path.join(tempInputDir, 'test-empty.txt');

    fs.writeFileSync(inputFile, '', 'utf-8');

    await processFile(inputFile, tempOutputDir, 1, 2);

    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(outputFile)).toBe(true);

    const outputContent = fs.readFileSync(outputFile, 'utf-8');
    // Empty file results in empty output (no duplicates found)
    expect(typeof outputContent).toBe('string');
  });

  it('should write formatted output with paragraph analysis', async () => {
    const inputFile = path.join(tempInputDir, 'test-format.txt');
    const inputContent = 'test word test word\nhello test hello';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    await processFile(inputFile, tempOutputDir, 1, 2);

    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    const outputContent = fs.readFileSync(outputFile, 'utf-8');

    // Verify output structure contains expected patterns
    expect(outputContent).toContain('palavras duplicadas no parágrafo');
    expect(outputContent).toMatch(/\w+/); // Contains words
  });

  it('should write to custom filename with --output flag', async () => {
    const inputFile = path.join(tempInputDir, 'test-custom-output.txt');
    const inputContent = 'hello world\nhello test\nworld test test';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    // Execute with custom output filename
    await processFile(inputFile, tempOutputDir, 1, 2, 'custom.txt');

    // Verify: Custom output file exists
    const customOutputFile = path.join(tempOutputDir, 'custom.txt');
    expect(fs.existsSync(customOutputFile)).toBe(true);

    // Verify: Default filename does NOT exist
    const defaultOutputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(defaultOutputFile)).toBe(false);

    // Verify: Custom file has content
    const outputContent = fs.readFileSync(customOutputFile, 'utf-8');
    expect(outputContent).toBeTruthy();
    expect(outputContent).toContain('palavras duplicadas');
  });

  it('should suppress console output with quiet flag', async () => {
    const inputFile = path.join(tempInputDir, 'test-quiet.txt');
    const inputContent = 'word word test';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    // Spy on console.log to verify suppression
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Execute with quiet flag
    await processFile(inputFile, tempOutputDir, 1, 1, undefined, true);

    // Verify: console.log was NOT called ("arquivo criado" message)
    expect(consoleLogSpy).not.toHaveBeenCalledWith('arquivo criado');

    // Verify: File was still written
    const outputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(outputFile)).toBe(true);

    consoleLogSpy.mockRestore();
  });

  it('should use custom filename AND suppress console with both flags', async () => {
    const inputFile = path.join(tempInputDir, 'test-both-flags.txt');
    const inputContent = 'test word word';

    fs.writeFileSync(inputFile, inputContent, 'utf-8');

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Execute with BOTH --output and --quiet
    await processFile(inputFile, tempOutputDir, 1, 2, 'combined.txt', true);

    // Verify: Custom file exists
    const customOutputFile = path.join(tempOutputDir, 'combined.txt');
    expect(fs.existsSync(customOutputFile)).toBe(true);

    // Verify: Default file does NOT exist
    const defaultOutputFile = path.join(tempOutputDir, 'resultado.txt');
    expect(fs.existsSync(defaultOutputFile)).toBe(false);

    // Verify: Console was silent
    expect(consoleLogSpy).not.toHaveBeenCalledWith('arquivo criado');

    // Verify: File has content
    const outputContent = fs.readFileSync(customOutputFile, 'utf-8');
    expect(outputContent).toBeTruthy();

    consoleLogSpy.mockRestore();
  });
});
