import os
from PIL import Image

# Set working directory to script location
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Custom renaming map
name_map = {
    'Dying': 'die',
    'Falling Down': 'fall',
    'Hurt': 'hurt',
    'Idle': 'idle',
    'Idle blinking': 'blink',
    'Jump loop': 'jumploop',
    'Jump Start': 'jumpstart',
    'Kicking': 'kick',
    'Run Slashing': 'rslash',
    'Run Throwing': 'rthrow',
    'Runing': 'run',
    'Slashing': 'slash',
    'Slashing in the Air': 'aslash',
    'Sliding': 'slid',
    'Throwing': 'throw',
    'Throwing in the air': 'athrow',
    'Walking': 'walk'
}

# Function to generate output filename based on folder name
def get_output_name(folder_name):
    name = folder_name.strip()
    return name_map.get(name, name.lower().replace(" ", "")) + '.png'

def stitch_images_in_folder(folder_path, output_name):
    image_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.png')]
    image_files.sort()

    if not image_files:
        print(f"No PNGs in {folder_path}. Skipping.")
        return

    images = [Image.open(os.path.join(folder_path, f)) for f in image_files]

    total_width = sum(img.width for img in images)
    max_height = max(img.height for img in images)

    stitched_image = Image.new('RGBA', (total_width, max_height), (0, 0, 0, 0))

    current_x = 0
    for img in images:
        stitched_image.paste(img, (current_x, 0))
        current_x += img.width

    stitched_image.save(output_name)
    print(f"Saved {output_name}")

# Go through all folders (recursive)
for root, dirs, files in os.walk(script_dir):
    for d in dirs:
        folder_path = os.path.join(root, d)
        output_filename = os.path.join(script_dir, get_output_name(d))
        stitch_images_in_folder(folder_path, output_filename)
