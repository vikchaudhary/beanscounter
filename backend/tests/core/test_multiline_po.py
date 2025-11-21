from PIL import Image, ImageDraw, ImageFont
import os

def create_multiline_po():
    # Create white image
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("Arial.ttf", 20)
    except:
        font = ImageFont.load_default()

    d.text((50, 50), "Purchase Order", fill='black', font=font)
    
    # PO Label on one line, value on next
    d.text((50, 100), "PO Number:", fill='black', font=font)
    d.text((50, 130), "XYZ-999", fill='black', font=font)
    
    d.text((50, 200), "Total: $100.00", fill='black', font=font)
    
    img.save("test_multiline_po.png")
    print("Created test_multiline_po.png")

if __name__ == "__main__":
    create_multiline_po()
