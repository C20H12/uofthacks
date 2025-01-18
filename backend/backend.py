from flask import Flask, request
import google.generativeai as genai
#from google import genai
import os
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

import time
import base64
app = Flask(__name__)

import base64

def image_to_base64(image_path):
  """
  Converts an image from a given file path to a Base64 string.

  Args:
    image_path: The path to the image file.

  Returns:
    The Base64 encoded string of the image, or None if the file 
    could not be opened.
  """
  try:
    with open(image_path, "rb") as image_file:
      encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
      return encoded_string
  except FileNotFoundError:
    print(f"File not found: {image_path}")
    return None
  except Exception as e:
    print(f"An error occurred: {e}")
    return None

@app.route('/')
def index():
    return "Hello, World!"

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Uploads a video file to the backend, which will have AI process the video file and return a text description of the video.
# Also contains options for AI to consider when generating text
@app.route('/upload_video', methods=['POST'])
def upload_video():
    file = request.form.get('video_file')
    file.save('uploaded_file.mp4')
    myfile = genai.upload_file(file)
    print(f"{myfile=}")

    # Videos need to be processed before you can use them.
    while myfile.state.name == "PROCESSING":
        print("processing video...")
        time.sleep(5)
        myfile = genai.get_file(myfile.name)

    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content([myfile, "Describe this video clip, DO NOT mention people in the description. Instead replace with cartoon characters. \
                                    KEEP the description within 50 words.\
                                    Highlight actions/items, and the emotions that is involved. \
                                    The description should only focus on the actions/items. Then, using this description, \
                                    generate an alternate reality for the following text that shows a better outcome, \
                                    for example, the alternate reality for late to work, is being early."])
    print(f"{result.text=}")
    return result.text

PROJECT_ID = "imagegenproject" 
vertexai.init(project=PROJECT_ID, location="us-central1")
model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
MAX_ATTEMPTS = 2

@app.route('/generate_image', methods=['POST'])
def generate_image():
    prompt = request.form.get('text')
    count = 0

    images = []

    while len(images) <= 0 and count < MAX_ATTEMPTS: 
        images = model.generate_images(
            prompt=prompt,
            # Optional parameters
            number_of_images=4,
            language="en",
            # You can't use a seed value and watermark at the same time.
            # add_watermark=False,
            # seed=100,
            aspect_ratio="1:1",
            # safety_filter_level="block_some",
            #person_generation="allow_adult",
        )

        images = images.images; 
        count += 1

    if len(images) > 0:
        gen_images = []
        for count, image in enumerate(images):
            image.save(location=f'output_{count}.png', include_generation_parameters=False)
            # Optional. View the generated image in a notebook.
            image.show()
            gen_images.append(image_to_base64(f'output_{count}.png'))

            print(f"Created output image using {len(image._image_bytes)} bytes")

            return gen_images
    # Example response:
    # Created output image using 1234567 bytes
    else: 
        print("No images generated")
        return []

if __name__ == '__main__':
    app.run(debug=True)

