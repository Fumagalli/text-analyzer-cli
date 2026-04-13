import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import trataErros from './erros/funcoesErro.js';
import { countWords, type WordCountMap } from './index.js';
import { buildOutputFormat } from './helpers.js';
import { Command } from 'commander';
import chalk from 'chalk';

export function validatePositiveInteger(value: string, name: string): number {
  const number = parseInt(value, 10);

  if (Number.isNaN(number) || number <= 0) {
    console.error(
      chalk.red(`erro: ${name} deve ser um número inteiro positivo`)
    );
    process.exit(1);
  }

  return number;
}

export function buildProgram(): Command {
  const program = new Command();

  program
    .version('0.0.1')
    .option('-t, --texto <string>', 'caminho do texto a ser processado')
    .option(
      '-d, --destino <string>',
      'caminho da pasta onde salvar o arquivo de resultados'
    )
    .option('-m, --min-chars <number>', 'tamanho mínimo de palavra', '3')
    .option(
      '-c, --min-count <number>',
      'ocorrências mínimas para considerar duplicada',
      '2'
    )
    .option(
      '-o, --output <string>',
      'nome do arquivo de saída',
      'resultado.txt'
    )
    .option('-q, --quiet', 'suprime saída no console')
    .action(
      async (options: {
        texto: string;
        destino: string;
        minChars: string;
        minCount: string;
        output: string;
        quiet: boolean;
      }) => {
        const { texto, destino, minChars, minCount, output, quiet } = options;

        if (!texto || !destino) {
          console.error(
            chalk.red('erro: favor inserir caminho de origem e destino')
          );
          program.outputHelp();
          return;
        }

        const minCharsNumber = validatePositiveInteger(minChars, '--min-chars');
        const minCountNumber = validatePositiveInteger(minCount, '--min-count');

        const textPath = path.resolve(texto);
        const destinationPath = path.resolve(destino);

        try {
          await validateInput(textPath, destinationPath, quiet);

          await processFile(
            textPath,
            destinationPath,
            minCharsNumber,
            minCountNumber,
            output,
            quiet
          );
          if (!quiet) {
            console.log(chalk.green('texto processado com sucesso'));
          }
        } catch (error) {
          try {
            trataErros(error as Error);
          } catch (customError) {
            console.log(chalk.red((customError as Error).message));
          }
        }
      }
    );

  return program;
}

export const program = buildProgram();

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse();
}

export async function validateInput(
  textPath: string,
  destinationPath: string,
  _quiet?: boolean
): Promise<void> {
  if (path.extname(textPath).toLowerCase() !== '.txt') {
    throw new Error(`Arquivo precisa ter extensão .txt: ${textPath}`);
  }

  try {
    await fs.promises.access(textPath, fs.constants.R_OK);
  } catch {
    throw new Error(`Arquivo não encontrado: ${textPath}`);
  }

  const textStats = await fs.promises.stat(textPath);
  if (!textStats.isFile()) {
    throw new Error(`Não é um arquivo: ${textPath}`);
  }

  try {
    await fs.promises.access(destinationPath, fs.constants.R_OK);
  } catch {
    throw new Error(`Diretório não existe: ${destinationPath}`);
  }

  const destinationStats = await fs.promises.stat(destinationPath);
  if (!destinationStats.isDirectory()) {
    throw new Error(`Não é um diretório: ${destinationPath}`);
  }
}

export async function processFile(
  text: string,
  destination: string,
  minChars: number,
  minCount: number,
  outputFile?: string,
  quiet?: boolean
): Promise<void> {
  const content = await fs.promises.readFile(text, 'utf-8');
  const result = countWords(content, minChars);
  await createAndSaveFile(result, destination, minCount, outputFile, quiet);
}

export async function createAndSaveFile(
  wordList: WordCountMap[],
  destination: string,
  minCount: number,
  outputFile: string = 'resultado.txt',
  quiet?: boolean
): Promise<void> {
  const newFile = path.join(destination, outputFile);
  const wordOutput = buildOutputFormat(wordList, minCount);

  await fs.promises.writeFile(newFile, wordOutput);
  if (!quiet) {
    console.log('arquivo criado');
  }
}
