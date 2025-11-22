from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List, Dict, Any
import os
import subprocess
import platform
from beanscounter.core.po_reader import POReader

# Assuming POs are stored in a 'data/pos' directory relative to backend root
# Adjust this path as needed based on where the user keeps their POs
# backend/src/beanscounter/api/routers/invoices.py -> backend/data/pos
PO_DIR = Path(__file__).parents[5] / "backend" / "data" / "pos" 

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/health")
def health():
    return {"status": "ok"}

@router.get("/pos")
def list_pos() -> List[Dict[str, str]]:
    """List available PO files."""
    if not PO_DIR.exists():
        return []
    
    pos = []
    for f in PO_DIR.glob("*.pdf"):
        pos.append({
            "id": f.name,
            "filename": f.name,
            "date": "2023-11-21" # Placeholder, in real app we'd read file stats or metadata
        })
    # Also look for images if needed, but user said "image file or PDF"
    # Let's add basic image support
    for ext in ["*.png", "*.jpg", "*.jpeg"]:
        for f in PO_DIR.glob(ext):
             pos.append({
                "id": f.name,
                "filename": f.name,
                "date": "2023-11-21"
            })
    return pos

@router.post("/pos/open-folder")
def open_folder():
    """Open the PO directory in the system file explorer."""
    if not PO_DIR.exists():
        raise HTTPException(status_code=404, detail="Directory not found")
    
    try:
        if platform.system() == "Darwin":  # macOS
            subprocess.run(["open", str(PO_DIR)])
        elif platform.system() == "Windows":
            os.startfile(str(PO_DIR))
        else:  # Linux
            subprocess.run(["xdg-open", str(PO_DIR)])
        return {"status": "opened"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pos/{filename}/file")
def get_po_file(filename: str):
    """Serve the raw PO file."""
    file_path = PO_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@router.post("/pos/{filename}/parse")
def parse_po(filename: str) -> Dict[str, Any]:
    """Parse the PO file and extract details."""
    file_path = PO_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        reader = POReader()
        data = reader.extract_data(file_path)
        
        # Map backend data model to frontend expected format
        # Frontend expects: vendor_name, vendor_address, po_number, date, total_amount, line_items
        # Backend returns: customer, customer_address, po_number, order_date, invoice_amount, items
        
        frontend_items = []
        for item in data.get("items", []):
            frontend_items.append({
                "description": item.get("product_name", ""),
                "quantity": item.get("quantity", 0),
                "unit_price": f"${item.get('rate', 0):.2f}",
                "amount": f"${item.get('price', 0):.2f}"
            })
            
        return {
            "vendor_name": data.get("customer", "Unknown"),
            "vendor_address": data.get("customer_address", "Unknown"),
            "po_number": data.get("po_number", "Unknown"),
            "date": data.get("order_date", "Unknown"),
            "total_amount": f"${data.get('invoice_amount', 0):.2f}",
            "line_items": frontend_items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
