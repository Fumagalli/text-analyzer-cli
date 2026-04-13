import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import trataErros from './erros/funcoesErro.js';
import { contaPalavras, type ContagemParagrafo } from './index.js';
import { montaSaidaArquivo } from './helpers.js';
import { Command } from 'commander';
import chalk from 'chalk';

export function validaInteiroPositivo(valor: string, nome: string): number {
  const numero = parseInt(valor, 10);

  if (Number.isNaN(numero) || numero <= 0) {
    console.error(
      chalk.red(`erro: ${nome} deve ser um número inteiro positivo`)
    );
    process.exit(1);
  }

  return numero;
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

        const minCharsNumero = validaInteiroPositivo(minChars, '--min-chars');
        const minCountNumero = validaInteiroPositivo(minCount, '--min-count');

        const caminhoTexto = path.resolve(texto);
        const caminhoDestino = path.resolve(destino);

        try {
          await validaEntrada(caminhoTexto, caminhoDestino, quiet);

          await processaArquivo(
            caminhoTexto,
            caminhoDestino,
            minCharsNumero,
            minCountNumero,
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

export async function validaEntrada(
  caminhoTexto: string,
  caminhoDestino: string,
  _quiet?: boolean
): Promise<void> {
  if (path.extname(caminhoTexto).toLowerCase() !== '.txt') {
    throw new Error(`Arquivo precisa ter extensão .txt: ${caminhoTexto}`);
  }

  try {
    await fs.promises.access(caminhoTexto, fs.constants.R_OK);
  } catch {
    throw new Error(`Arquivo não encontrado: ${caminhoTexto}`);
  }

  const statsTexto = await fs.promises.stat(caminhoTexto);
  if (!statsTexto.isFile()) {
    throw new Error(`Não é um arquivo: ${caminhoTexto}`);
  }

  try {
    await fs.promises.access(caminhoDestino, fs.constants.R_OK);
  } catch {
    throw new Error(`Diretório não existe: ${caminhoDestino}`);
  }

  const statsDestino = await fs.promises.stat(caminhoDestino);
  if (!statsDestino.isDirectory()) {
    throw new Error(`Não é um diretório: ${caminhoDestino}`);
  }
}

export async function processaArquivo(
  texto: string,
  destino: string,
  minChars: number,
  minCount: number,
  outputFile?: string,
  quiet?: boolean
): Promise<void> {
  const conteudo = await fs.promises.readFile(texto, 'utf-8');
  const resultado = contaPalavras(conteudo, minChars);
  await criaESalvaArquivo(resultado, destino, minCount, outputFile, quiet);
}

export async function criaESalvaArquivo(
  listaPalavras: ContagemParagrafo[],
  endereco: string,
  minCount: number,
  outputFile: string = 'resultado.txt',
  quiet?: boolean
): Promise<void> {
  const arquivoNovo = path.join(endereco, outputFile);
  const textoPalavras = montaSaidaArquivo(listaPalavras, minCount);

  await fs.promises.writeFile(arquivoNovo, textoPalavras);
  if (!quiet) {
    console.log('arquivo criado');
  }
}
