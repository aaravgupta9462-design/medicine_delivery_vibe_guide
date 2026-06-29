import urllib.request
import urllib.parse
import json
import ssl
import os
import re
import time

# Set up directories
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')
CATEGORIES_DIR = os.path.join(PUBLIC_DIR, 'images', 'categories')
PRODUCTS_DIR = os.path.join(PUBLIC_DIR, 'images', 'products')

os.makedirs(CATEGORIES_DIR, exist_ok=True)
os.makedirs(PRODUCTS_DIR, exist_ok=True)

# Queries mapped to slugs
CATEGORY_QUERIES = {
    'prescription': 'prescription pills medicine',
    'supplements': 'supplement vitamins capsules',
    'personal-care': 'personal care hygiene cosmetics',
    'baby-care': 'baby care items bottle diaper',
    'medical-devices': 'medical equipment stethoscope monitor',
    'first-aid': 'first aid kit bandages'
}

PRODUCT_QUERIES = {
    'amoxicillin': 'Amoxicillin capsules',
    'metformin': 'Metformin tablets',
    'atorvastatin': 'Atorvastatin tablets',
    'omeprazole': 'Omeprazole capsules',
    'azithromycin': 'Azithromycin tablets',
    'revital': 'multivitamin capsules vitamins',
    'vitamind3': 'Vitamin D3 capsules',
    'omega3': 'fish oil capsules Omega-3',
    'calcium-mag-zinc': 'mineral supplement tablets zinc calcium',
    'cetaphil': 'skin cleanser bottle moisturizer',
    'himalaya-neem': 'herbal face wash bottle neem',
    'sensodyne': 'toothpaste tube Sensodyne',
    'johnsons-shampoo': 'baby shampoo bottle shampoo',
    'pampers': 'baby diaper nappies',
    'himalaya-baby-cream': 'baby cream lotion baby care',
    'omron-bp': 'sphygmomanometer blood pressure monitor',
    'accu-chek': 'blood glucose meter glucometer',
    'thermometer': 'clinical digital thermometer temperature',
    'band-aid': 'adhesive bandage band-aid plaster',
    'dettol': 'antiseptic bottle Dettol',
    'savlon-spray': 'antiseptic spray wound first aid'
}

# Real, verified fallback URLs from Wikimedia Commons
FALLBACKS = {
    'category': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Various_pills.jpg',
    'product': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Tablets_and_Capsules.jpg'
}

# Standard browser headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_wikimedia(query):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            time.sleep(2) # rate limit prevention
            url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                results = data.get('query', {}).get('search', [])
                
                if not results:
                    # Try a broader search
                    broad_query = query.split()[-1]
                    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(broad_query)}&srnamespace=6&format=json"
                    req = urllib.request.Request(url, headers=HEADERS)
                    time.sleep(1)
                    with urllib.request.urlopen(req, context=ctx, timeout=10) as broad_response:
                        data = json.loads(broad_response.read().decode('utf-8'))
                        results = data.get('query', {}).get('search', [])
                
                if results:
                    # Get the first result's direct image URL
                    title = results[0].get('title')
                    info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                    info_req = urllib.request.Request(info_url, headers=HEADERS)
                    time.sleep(1)
                    with urllib.request.urlopen(info_req, context=ctx, timeout=10) as info_response:
                        info_data = json.loads(info_response.read().decode('utf-8'))
                        pages = info_data.get('query', {}).get('pages', {})
                        for page_id, page_info in pages.items():
                            imageinfo = page_info.get('imageinfo', [])
                            if imageinfo:
                                img_url = imageinfo[0].get('url')
                                # Avoid PDFs
                                if img_url.lower().endswith('.pdf'):
                                    continue
                                return img_url
            return None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                sleep_time = 5 * (attempt + 1)
                print(f"HTTP 429 for '{query}'. Sleeping {sleep_time}s and retrying...")
                time.sleep(sleep_time)
            else:
                print(f"HTTP error for '{query}': {e.code}")
                break
        except Exception as e:
            print(f"Wikimedia search failed for '{query}': {e}")
            break
    return None

def download_image(url, dest_path):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Check if PDF - we want to avoid downloading PDFs
            if url.lower().endswith('.pdf'):
                print(f"Skipping PDF URL: {url}")
                return False
                
            req = urllib.request.Request(url, headers=HEADERS)
            time.sleep(1)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
                with open(dest_path, 'wb') as f:
                    f.write(response.read())
            print(f"Downloaded to {dest_path}")
            return True
        except urllib.error.HTTPError as e:
            if e.code == 429:
                sleep_time = 5 * (attempt + 1)
                print(f"HTTP 429 during download from {url}. Sleeping {sleep_time}s and retrying...")
                time.sleep(sleep_time)
            else:
                print(f"HTTP error during download from {url}: {e.code}")
                break
        except Exception as e:
            print(f"Download failed from {url}: {e}")
            break
    return False

def main():
    print("Starting download of high-quality product and category images...")
    
    # 1. Download categories
    for slug, query in CATEGORY_QUERIES.items():
        dest_path = os.path.join(CATEGORIES_DIR, f"{slug}.jpg")
        
        # Skip if already exists
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
            print(f"Category image '{slug}' already exists. Skipping.")
            continue
            
        print(f"Processing Category: {slug} (query: {query})")
        img_url = search_wikimedia(query)
        if not img_url:
            print(f"No Wikimedia result for category '{slug}', using fallback.")
            img_url = FALLBACKS['category']
            
        success = download_image(img_url, dest_path)
        if not success:
            # try direct download of fallback
            download_image(FALLBACKS['category'], dest_path)

    # 2. Download products
    for slug, query in PRODUCT_QUERIES.items():
        dest_path = os.path.join(PRODUCTS_DIR, f"{slug}.jpg")
        
        # Skip if already exists
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
            print(f"Product image '{slug}' already exists. Skipping.")
            continue
            
        print(f"Processing Product: {slug} (query: {query})")
        img_url = search_wikimedia(query)
        if not img_url:
            print(f"No Wikimedia result for product '{slug}', using fallback.")
            img_url = FALLBACKS['product']
            
        success = download_image(img_url, dest_path)
        if not success:
            download_image(FALLBACKS['product'], dest_path)

    print("Image download completed successfully!")

if __name__ == '__main__':
    main()
