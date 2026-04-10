# PrimeiraBiblioteca

Uma ferramenta de linha de comando para analisar textos e identificar palavras duplicadas em parágrafos.

## Descrição

Este projeto é uma biblioteca Node.js que lê arquivos de texto, divide o conteúdo em parágrafos e identifica palavras que aparecem mais de uma vez em cada parágrafo. Palavras com menos de 3 caracteres são ignoradas.

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:

```bash
npm install
```

## Uso

Execute o comando com os caminhos para o arquivo de texto e o diretório de destino:

```bash
npm run cli -- -t caminho/para/arquivo.txt -d caminho/para/diretorio
```

### Opções

- `-t, --texto <string>`: Caminho do arquivo de texto a ser processado (obrigatório)
- `-d, --destino <string>`: Caminho do diretório onde salvar o arquivo de resultados (obrigatório)
- `-m, --min-chars <number>`: Número mínimo de caracteres para considerar uma palavra (padrão: 3)
- `-c, --min-count <number>`: Número mínimo de ocorrências para considerar duplicada (padrão: 2)
- `-h, --help`: Mostra ajuda
- `-V, --version`: Mostra versão

### Exemplo

```bash
npm run cli -- -t arquivos/texto-kanban.txt -d resultados
```

Saída esperada: `resultados/resultado.txt` com linhas como:

```
palavras duplicadas no parágrafo 1: palavra1, palavra2
palavras duplicadas no parágrafo 2: palavra3
```

## Testes

Para executar os testes:

```bash
npm test
```

## Estrutura do Projeto

- `src/cli.ts`: Interface de linha de comando
- `src/index.ts`: Lógica principal de contagem de palavras
- `src/helpers.ts`: Funções auxiliares para formatação de saída
- `src/erros/funcoesErro.ts`: Tratamento de erros
- `arquivos/`: Exemplos de arquivos de texto
- `resultados/`: Diretório para arquivos de saída

## Dependências

- `commander`: Para parsing de argumentos da CLI
- `chalk`: Para saída colorida no terminal

## Desenvolvimento

Este projeto foi criado como parte de um curso da Alura sobre JavaScript e Node.js, focando em:

- Lógica de programação
- Comandos de terminal
- Promessas e código assíncrono
- Uso de bibliotecas nativas do Node.js (fs)
- Importação de métodos de bibliotecas open source

### Scripts disponíveis

- `npm test`: Executa os testes com Vitest
- `npm run lint`: Verifica o código com ESLint
- `npm run lint:fix`: Corrige automaticamente problemas de linting
- `npm run format`: Formata o código com Prettier
- `npm run typecheck`: Verifica tipos TypeScript
- `npm run cli`: Executa a ferramenta CLI (use com -- para opções)
