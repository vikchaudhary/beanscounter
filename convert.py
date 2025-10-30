import PyPDF2
import re
import csv
from datetime import datetime
from pathlib import Path

def extract_text_from_pdf(pdf_path):
    """Extract text content from PDF file."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def parse_invoice_data(text):
    """Extract relevant fields from invoice text."""
    data = {}
    
    # Normalize whitespace: replace tabs and multiple spaces with single space
    text = re.sub(r'[\t]+', ' ', text)  # Replace tabs with spaces
    text = re.sub(r' +', ' ', text)  # Replace multiple spaces with single space
    
    # Debug: Print first 500 characters of extracted text
    print("DEBUG - First 500 chars of PDF text (after normalization):")
    print(text[:500])
    print("\n" + "="*50 + "\n")
    
    # Invoice number
    invoice_match = re.search(r'Invoice No#:\s*(\d+)', text)
    data['invoice_number'] = invoice_match.group(1) if invoice_match else ''
    print(f"Invoice Number: {data['invoice_number']}")
    
    # Invoice date
    date_match = re.search(r'Invoice Date:\s*([A-Za-z]+\s+\d+,\s+\d{4})', text)
    if date_match:
        date_str = date_match.group(1)
        data['invoice_date'] = datetime.strptime(date_str, '%b %d, %Y').strftime('%m/%d/%Y')
    else:
        data['invoice_date'] = ''
    print(f"Invoice Date: {data['invoice_date']}")
    
    # Parse BILL TO section - improved to handle actual PDF format
    bill_to_section = re.search(r'BILL TO\s+(.*?)(?=SHIP TO|Subtotal)', text, re.DOTALL)
    
    if bill_to_section:
        bill_to_text = bill_to_section.group(1).strip()
        lines = [line.strip() for line in bill_to_text.split('\n') if line.strip()]
        
        print(f"DEBUG - BILL TO lines: {lines}")
        
        if len(lines) >= 5:
            data['customer_name'] = lines[0]
            data['contact_person'] = lines[1]
            data['address_line1'] = lines[2]
            data['address_line2'] = lines[3]
            data['customer_email'] = lines[4]
        elif len(lines) >= 3:
            # Fallback for shorter format
            data['customer_name'] = lines[0]
            data['contact_person'] = lines[1] if len(lines) > 1 else ''
            data['address_line1'] = ', '.join(lines[2:])
            data['address_line2'] = ''
            # Find email in the text
            email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', bill_to_text)
            data['customer_email'] = email_match.group(1) if email_match else ''
        else:
            data['customer_name'] = ''
            data['contact_person'] = ''
            data['address_line1'] = ''
            data['address_line2'] = ''
            data['customer_email'] = ''
        
        print(f"Customer: {data['customer_name']}")
        print(f"Contact: {data['contact_person']}")
        print(f"Address Line 1: {data['address_line1']}")
        print(f"Address Line 2: {data['address_line2']}")
        print(f"Email: {data['customer_email']}")
    else:
        data['customer_name'] = ''
        data['contact_person'] = ''
        data['address_line1'] = ''
        data['address_line2'] = ''
        data['customer_email'] = ''
        print("WARNING: BILL TO section not found!")
    
    # Parse SHIP TO section
    ship_to_section = re.search(r'SHIP TO\s+(.*?)(?=Subtotal|Tax|Tip|TOTAL)', text, re.DOTALL)
    
    if ship_to_section:
        ship_to_text = ship_to_section.group(1).strip()
        lines = [line.strip() for line in ship_to_text.split('\n') if line.strip()]
        
        print(f"\nDEBUG - SHIP TO lines: {lines}")
        
        if len(lines) >= 5:
            data['ship_to_name'] = lines[0]
            data['ship_to_contact'] = lines[1]
            data['ship_to_address1'] = lines[2]
            data['ship_to_address2'] = lines[3]
            # Email might be on line 4 or embedded elsewhere
            data['ship_to_email'] = lines[4] if '@' in lines[4] else ''
        elif len(lines) >= 3:
            data['ship_to_name'] = lines[0]
            data['ship_to_contact'] = lines[1] if len(lines) > 1 else ''
            data['ship_to_address1'] = ', '.join(lines[2:])
            data['ship_to_address2'] = ''
            data['ship_to_email'] = ''
        else:
            data['ship_to_name'] = ''
            data['ship_to_contact'] = ''
            data['ship_to_address1'] = ''
            data['ship_to_address2'] = ''
            data['ship_to_email'] = ''
        
        print(f"Ship To Name: {data['ship_to_name']}")
        print(f"Ship To Contact: {data['ship_to_contact']}")
        print(f"Ship To Address 1: {data['ship_to_address1']}")
        print(f"Ship To Address 2: {data['ship_to_address2']}")
        print(f"Ship To Email: {data['ship_to_email']}")
    else:
        data['ship_to_name'] = ''
        data['ship_to_contact'] = ''
        data['ship_to_address1'] = ''
        data['ship_to_address2'] = ''
        data['ship_to_email'] = ''
        print("WARNING: SHIP TO section not found!")
    
    # Subtotal
    subtotal_match = re.search(r'Subtotal\s+\$?([\d,]+\.\d{2})', text)
    data['subtotal'] = subtotal_match.group(1).replace(',', '') if subtotal_match else '0.00'
    
    # Tax
    tax_match = re.search(r'Tax\s+[^\n]+\s+\$?([\d,]+\.\d{2})', text)
    data['tax'] = tax_match.group(1).replace(',', '') if tax_match else '0.00'
    
    # Tip
    tip_match = re.search(r'Tip\s+\$?([\d,]+\.\d{2})', text)
    data['tip'] = tip_match.group(1).replace(',', '') if tip_match else '0.00'
    
    # Total
    total_match = re.search(r'TOTAL\s+\$?([\d,]+\.\d{2})\s+USD', text)
    data['total'] = total_match.group(1).replace(',', '') if total_match else '0.00'
    
    # Amount paid
    paid_match = re.search(r'Amount paid\s+\$?([\d,]+\.\d{2})', text)
    data['amount_paid'] = paid_match.group(1).replace(',', '') if paid_match else '0.00'
    
    # Amount due
    due_match = re.search(r'AMOUNT DUE\s+\$?([\d,]+\.\d{2})\s+USD', text)
    data['amount_due'] = due_match.group(1).replace(',', '') if due_match else '0.00'
    
    # Line items - improved extraction
    data['line_items'] = []
    
    # Find the items section - it comes AFTER "Taxable item" or "# ITEMS & DESCRIPTION"
    # Changed pattern to look until end of text or a section marker
    items_section = re.search(r'#\s*ITEMS\s*&\s*DESCRIPTION.*', text, re.DOTALL)
    if items_section:
        items_text = items_section.group(0)
        print(f"\nDEBUG - Items section found:")
        print(items_text[:500])
        print("\n" + "="*50 + "\n")
        
        lines = items_text.split('\n')
        print(f"DEBUG - Number of lines in items section: {len(lines)}")
        
        for i, line in enumerate(lines):
            print(f"Line {i}: {line}")
            # Check if line starts with a number (new item)
            item_start = re.match(r'^(\d+)\s+(.+)', line)
            if item_start:
                print(f"  -> FOUND ITEM START!")
                item_num = item_start.group(1)
                rest_of_line = item_start.group(2)
                
                # Extract all dollar amounts from the line
                amounts = re.findall(r'\$?([\d,]+\.\d{2})', rest_of_line)
                print(f"  -> Amounts found: {amounts}")
                
                # Find quantity (number before a dollar sign)
                dollar_sign = r'\$'
                qty_pattern = r'\s(\d+)\s+' + dollar_sign
                qty_match = re.search(qty_pattern, rest_of_line)
                
                # Get description (everything before the quantity)
                if qty_match:
                    desc_end = qty_match.start()
                    description = rest_of_line[:desc_end].strip()
                    quantity = qty_match.group(1)
                else:
                    # Fallback
                    desc_match = re.match(r'^(.*?)\s+\d+\s+\$', rest_of_line)
                    if desc_match:
                        description = desc_match.group(1).strip()
                        quantity = '1'
                    else:
                        description = rest_of_line.strip()
                        quantity = '1'
                
                # Extract rate and amount (last two dollar amounts)
                if len(amounts) >= 2:
                    rate = amounts[-2].replace(',', '')
                    amount = amounts[-1].replace(',', '')
                elif len(amounts) == 1:
                    rate = amounts[0].replace(',', '')
                    amount = amounts[0].replace(',', '')
                else:
                    rate = '0.00'
                    amount = '0.00'
                
                item = {
                    'item_number': item_num,
                    'description': description,
                    'quantity': quantity,
                    'rate': rate,
                    'amount': amount
                }
                data['line_items'].append(item)
                print(f"  -> Added item: {item}")
        
        print(f"\nTotal line items extracted: {len(data['line_items'])}")
    else:
        print("WARNING: Items section not found in text!")
    
    return data

def create_quickbooks_csv(invoice_data_list, output_file='quickbooks_import.csv'):
    """Create QuickBooks-compatible CSV from invoice data."""
    
    headers = [
        'Invoice Number',
        'Customer',
        'Contact Person',
        'Address Line 1',
        'Address Line 2',
        'Customer Email',
        'Ship To Name',
        'Ship To Contact',
        'Ship To Address 1',
        'Ship To Address 2',
        'Ship To Email',
        'Invoice Date',
        'Due Date',
        'Item Number',
        'Item Description',
        'Quantity',
        'Item Rate',
        'Item Amount',
        'Tax Amount',
        'Tip Amount',
        'Total Amount',
        'Amount Paid',
        'Balance Due'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        
        for data in invoice_data_list:
            line_items = data.get('line_items', [])
            
            print("\n" + "="*80)
            print("EXTRACTED LINE ITEMS (mapped to PDF columns):")
            print("="*80)
            print(f"{'#':<5} {'ITEMS & DESCRIPTION':<40} {'QTY/HRS':<10} {'PRICE':<12} {'AMOUNT($)':<12}")
            print("-"*80)
            
            if not line_items:
                print("WARNING: No line items found!")
                # If no line items, create one row with invoice totals only
                row = [
                    data.get('invoice_number', ''),
                    data.get('customer_name', ''),
                    data.get('contact_person', ''),
                    data.get('address_line1', ''),
                    data.get('address_line2', ''),
                    data.get('customer_email', ''),
                    data.get('ship_to_name', ''),
                    data.get('ship_to_contact', ''),
                    data.get('ship_to_address1', ''),
                    data.get('ship_to_address2', ''),
                    data.get('ship_to_email', ''),
                    data.get('invoice_date', ''),
                    data.get('invoice_date', ''),
                    '',
                    '',
                    '',
                    '',
                    data.get('subtotal', '0.00'),
                    data.get('tax', '0.00'),
                    data.get('tip', '0.00'),
                    data.get('total', '0.00'),
                    data.get('amount_paid', '0.00'),
                    data.get('amount_due', '0.00')
                ]
                writer.writerow(row)
            else:
                # Create one row per line item
                for i, item in enumerate(line_items):
                    # Print extracted line item in table format
                    item_num = item.get('item_number', '')
                    description = item.get('description', '')[:40]  # Truncate for display
                    quantity = item.get('quantity', '')
                    rate = f"${item.get('rate', '0.00')}"
                    amount = f"${item.get('amount', '0.00')}"
                    
                    print(f"{item_num:<5} {description:<40} {quantity:<10} {rate:<12} {amount:<12}")
                    
                    row = [
                        data.get('invoice_number', ''),
                        data.get('customer_name', ''),
                        data.get('contact_person', ''),
                        data.get('address_line1', ''),
                        data.get('address_line2', ''),
                        data.get('customer_email', ''),
                        data.get('ship_to_name', ''),
                        data.get('ship_to_contact', ''),
                        data.get('ship_to_address1', ''),
                        data.get('ship_to_address2', ''),
                        data.get('ship_to_email', ''),
                        data.get('invoice_date', ''),
                        data.get('invoice_date', ''),
                        item.get('item_number', ''),
                        item.get('description', ''),
                        item.get('quantity', ''),
                        item.get('rate', ''),
                        item.get('amount', ''),
                        data.get('tax', '0.00') if i == len(line_items) - 1 else '',
                        data.get('tip', '0.00') if i == len(line_items) - 1 else '',
                        data.get('total', '0.00') if i == len(line_items) - 1 else '',
                        data.get('amount_paid', '0.00') if i == len(line_items) - 1 else '',
                        data.get('amount_due', '0.00') if i == len(line_items) - 1 else ''
                    ]
                    writer.writerow(row)
                
                print("-"*80)
                print(f"Total items extracted: {len(line_items)}")
                print(f"Subtotal: ${data.get('subtotal', '0.00')}")
                print(f"Tax: ${data.get('tax', '0.00')}")
                print(f"Tip: ${data.get('tip', '0.00')}")
                print(f"Total: ${data.get('total', '0.00')}")
                print("="*80)
    
    print(f"\n✓ QuickBooks CSV created: {output_file}")
    
    print(f"QuickBooks CSV created: {output_file}")

def process_single_pdf(pdf_path):
    """Process a single PDF and create CSV with matching name."""
    print(f"Processing: {pdf_path}")
    try:
        text = extract_text_from_pdf(pdf_path)
        invoice_data = parse_invoice_data(text)
        
        # Create output filename with same prefix as PDF
        pdf_file = Path(pdf_path)
        output_csv = pdf_file.stem + '.csv'
        
        create_quickbooks_csv([invoice_data], output_csv)
        print(f"  ✓ Extracted invoice #{invoice_data.get('invoice_number', 'N/A')}")
        print(f"  ✓ Created: {output_csv}")
        return True
    except Exception as e:
        print(f"  ✗ Error processing {pdf_path}: {str(e)}")
        return False

def process_pdf_directory(directory_path):
    """Process all PDF files in a directory, creating separate CSV for each."""
    pdf_files = list(Path(directory_path).glob('*.pdf'))
    
    if not pdf_files:
        print(f"No PDF files found in {directory_path}")
        return
    
    print(f"Processing {len(pdf_files)} PDF file(s)...\n")
    
    success_count = 0
    for pdf_file in pdf_files:
        if process_single_pdf(pdf_file):
            success_count += 1
        print()
    
    print(f"Successfully processed {success_count} of {len(pdf_files)} invoice(s)")

# Example usage
if __name__ == "__main__":
    # Option 1: Process a single PDF
    # process_single_pdf("Paypal Invoice 10881.pdf")
    # This will create: "Paypal Invoice 10881.csv"
    
    # Option 2: Process all PDFs in a directory (each gets its own CSV)
    directory = "."
    process_pdf_directory(directory)
    
    print("\nDone! Each PDF now has a matching CSV file.")
