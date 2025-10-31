# paypal2quickbooks

Convert PayPal invoice PDFs into CSV files suitable for QuickBooks import.

This repository is in active development and not ready for production use. The current backend provides a CLI to convert PDFs to CSVs and a placeholder FastAPI app with a health check. A React frontend is planned for later.

## Author
Vik Chaudhary <vik.chaudhary@gmail.com> 
Created Fri Oct 31, 2025 in San Francisco

## What It Does

- Scans a directory for `*.pdf` PayPal invoices.
- Extracts invoice data (placeholder parsing for now).
- Writes QuickBooks-style CSV files to an output folder.

CSV schema will evolve. The placeholder flow currently writes minimal fields (e.g., `InvoiceNumber`) and is intended to be expanded.

## Project Structure

- `backend/` Python package (`src` layout), Typer CLI, FastAPI stub.
- `frontend/` placeholder React app scaffold (Vite).
- `qa/` manual QA scripts and sample inputs/outputs.
- `docs/` notes for backend/frontend architecture.
- `.github/workflows/` CI for backend tests.

## Prerequisites

- Python `>=3.9` (tested on macOS)
- Optional (later): Node.js `>=18` for the frontend

## Setup

Create a virtual environment and install backend dependencies in editable mode:

```bash
make setup
```

This:
- Creates `.venv`
- Installs `backend/requirements.txt` and dev dependencies
- Installs the backend package (`-e backend`)

## Usage

Convert all PDFs in the current directory into `./output`:

```bash
make convert
```

Or run the CLI directly (after `make setup`):

```bash
. .venv/bin/activate && paypal2quickbooks
```

CLI options (for custom paths):

```bash
. .venv/bin/activate && paypal2quickbooks convert --input-dir ./qa/samples/input_pdfs --output-dir ./output
```

## API (Development)

Start the FastAPI dev server:

```bash
make dev-backend
```

Health endpoint:
- `GET http://localhost:8000/invoices/health` → `{"status":"ok"}`

Future endpoints will expose conversion as an HTTP API.

## Testing

Run backend tests:

```bash
make test
```

## Status & Caveats

- Parsing is a placeholder; real PDF extraction and mapping are pending.
- CSV headers and schema will change as QuickBooks import requirements are finalized.
- Do not use in production; interfaces and behavior may change without notice.

## Contributing

- Keep business logic in `backend/src/paypal2quickbooks/core/`.
- Orchestration lives in `backend/src/paypal2quickbooks/services/`.
- CLI under `backend/src/paypal2quickbooks/cli.py`.
- API routers under `backend/src/paypal2quickbooks/api/routers/`.

Open an issue or PR with proposed changes and tests where applicable.


