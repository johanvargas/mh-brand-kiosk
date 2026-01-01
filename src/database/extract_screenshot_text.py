#!/usr/bin/env python3
import sys
from PIL import Image
import pytesseract

if len(sys.argv) < 2:
    print("Usage: python3 extract_screenshot_text.py <image_path>")
    sys.exit(1)

image_path = sys.argv[1]
try:
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    print(text)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
