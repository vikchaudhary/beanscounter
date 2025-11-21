import pdfplumber
import sys
import re
from pathlib import Path

def debug_spatial(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        
        keywords = ["SHIP TO", "VENDOR", "ATTN:"]
        
        for kw in keywords:
            print(f"Searching for '{kw}'...")
            # Case insensitive search
            matches = page.search(kw, regex=False, case=False)
            
            if not matches:
                print(f"No '{kw}' found.")
                continue

            for i, match in enumerate(matches):
                print(f"Match {i}: {match}")
                
                x0 = match['x0']
                top = match['bottom']
                x1 = page.width
                bottom = top + 100 
                
                print(f"Cropping below match: {x0}, {top}, {x1}, {bottom}")
                
                try:
                    crop = page.crop((x0, top, x1, bottom))
                    text = crop.extract_text()
                    print(f"--- Extracted Text below '{kw}' ---")
                    print(text)
                    print("--------------------------------")
                except Exception as e:
                    print(f"Crop failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        debug_spatial(sys.argv[1])
    else:
        print("Please provide PDF path")
