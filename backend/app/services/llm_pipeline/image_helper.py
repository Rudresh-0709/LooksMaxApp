import os
import glob
import base64
import operator

def get_recent_images(user_folder_path, count=3):
    """
    Identifies the 'count' most recently modified image files in a directory,
    reads them, and returns a list of Base64-encoded strings and their MIME types.
    """
    
    # Define a list of expected image extensions
    IMAGE_EXTENSIONS = ['*.jpg', '*.jpeg', '*.png']
    
    all_files = []
    
    # 1. Identify and Locate Files
    for ext in IMAGE_EXTENSIONS:
        # glob finds all files matching the pattern
        all_files.extend(glob.glob(os.path.join(user_folder_path, ext)))
    
    if not all_files:
        return [] 
    all_files.sort(key=os.path.getmtime, reverse=True)
    
    # Select the top N (3) recent files
    recent_files = all_files[:count]
    
    base64_parts = []
    base64_list = []
    # 3. Select, Read, and Convert
    for file_path in recent_files:
        try:
            # Determine MIME type (required for the API call)
            # A simple lookup based on extension is often enough
            extension = os.path.splitext(file_path)[1].lower()
            mime_type = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png'
            }.get(extension, 'application/octet-stream')
            
            # Read the binary data
            with open(file_path, "rb") as image_file:
                binary_data = image_file.read()
                
            # Convert to Base64
            base64_string = base64.b64encode(binary_data).decode('utf-8')
            base64_string = base64_string + '=' * (-len(base64_string) % 4)  # ensure padding

            
            # Append the structured data for the API call
            base64_parts.append({
                "inlineData": {
                    "data": base64_string,
                    "mimeType": mime_type
                }
            })
            
        except IOError:
            print(f"Error reading file: {file_path}")
            continue # Skip to the next file
            
    return base64_parts

def get_only_recent_images(user_folder_path, count=3):
    """
    Identifies the 'count' most recently modified image files in a directory,
    reads them, and returns a list of Base64-encoded strings and their MIME types.
    """
    
    # Define a list of expected image extensions
    IMAGE_EXTENSIONS = ['*.jpg', '*.jpeg', '*.png']
    
    all_files = []
    
    # 1. Identify and Locate Files
    for ext in IMAGE_EXTENSIONS:
        # glob finds all files matching the pattern
        all_files.extend(glob.glob(os.path.join(user_folder_path, ext)))
    
    if not all_files:
        return [] 
    all_files.sort(key=os.path.getmtime, reverse=True)
    
    # Select the top N (3) recent files
    recent_files = all_files[:count]
    return recent_files