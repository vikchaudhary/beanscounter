# paypal2quickbooks

Convert PayPal invoice PDFs into CSV files suitable for QuickBooks import.

This repository is in active development and not ready for production use. The current backend provides a CLI to convert PDFs to CSVs and a placeholder FastAPI app with a health check. A React frontend is planned for later.

## Author
Vik Chaudhary <vik.chaudhary@gmail.com> 
Created Fri Oct 31, 2025 in San Francisco

## What It Does

The purpose of this project is to import PayPal or other invoices into QuickBooks.

- Scans a directory for `*.pdf` PayPal invoices.
- Extracts invoice data, and supports the PayPal invoice format.
- Writes QuickBooks-style CSV files to an output folder.
- These CSV files can be imported into QuickBooks only if there is no Sales Tax on the items, which is a QuickBooks limitation (unbelievable, I know).
- As a next step, I plan to add the ability to bypass QuickBooks' Sales Tax limitation by creating an invoice directly in QuickBooks.

## Project Structure

- `backend/` Python package (`src` layout), Typer CLI, FastAPI stub.
- `frontend/` placeholder React app scaffold (Vite).
- `qa/` manual QA scripts and sample inputs/outputs.
- `docs/` notes for backend/frontend architecture.
- `.github/workflows/` CI for backend tests.

## Prerequisites

- Python `>=3.9` (tested on macOS)
- Node.js `>=18` for the frontend (later)

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

## Caveats

- This is version 0.1.0 and is not ready for production use.
- Interfaces and behavior may change without notice.
- Author takes no responsibility for any damage or loss incurred from using this software.

## Contributors

If interested in contributing, please contact me at vik.chaudhary@gmail.com, and then open an issue or PR. Generous attribution will be given to substantial contributors.

- Keep business logic in `backend/src/paypal2quickbooks/core/`.
- Orchestration lives in `backend/src/paypal2quickbooks/services/`.
- CLI under `backend/src/paypal2quickbooks/cli.py`.
- API routers under `backend/src/paypal2quickbooks/api/routers/`.

Open an issue or PR with proposed changes and tests.


