from PIL import Image
import os

# Define the input and output directories
input_dir = "./images"
output_dir = "./images"
os.makedirs(output_dir, exist_ok=True)

# Define the target resolution
target_resolution = (600, 600)  # Adjust as needed for your website

# Process each image in the input directory
for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.png', '.jpeg', '.jpg')):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)

        # Open and resize the image
        with Image.open(input_path) as img:
            img.thumbnail(target_resolution)
            img.save(output_path)

        print(f"Resized and saved: {output_path}")

print("All images have been resized.")