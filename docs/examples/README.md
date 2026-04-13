# Example Files

These are example input and output files for testing text-analyzer-cli locally.

## Input Samples
- `input/texto-aprendizado.txt` — Example learning document
- `input/texto-kanban.txt` — Example kanban text
- `input/texto-web.txt` — Example web content

## Output Samples
- `output/resultado.txt` — Example analyzer output

## Usage

```bash
# Analyze an example input
npx text-analyzer-cli \
  --texto docs/examples/input/texto-aprendizado.txt \
  --destino docs/examples/output/

# With custom parameters
npx text-analyzer-cli \
  --texto docs/examples/input/texto-aprendizado.txt \
  --destino docs/examples/output/ \
  --output resultado-custom.txt \
  --min-chars 4 \
  --min-count 3
```

## Expected Output

The analyzer will create a results file with:
- Duplicate word analysis
- Paragraph statistics
- Word frequency counts
- Formatted for easy reading

See `output/resultado.txt` for an example of the output format.
