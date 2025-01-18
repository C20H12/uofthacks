import google.generativeai as genai
#from google import genai
import os

import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

import time

### Video to Text Generation using Google Gemini

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

myfile = genai.upload_file("petal_20250118_012647.mp4")#"decoded_video.mp4")#"petal_20250118_012647.mp4")
print(f"{myfile=}")

# Videos need to be processed before you can use them.
while myfile.state.name == "PROCESSING":
    print("processing video...")
    time.sleep(5)
    myfile = genai.get_file(myfile.name)

model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content([myfile, "Describe this video clip, DO NOT mention people in the description. \
                                 Instead evaluate the mood of the video, and decide on the best way (through animal, object, symbol, etc) to replace the human. \
                                 KEEP the description within 50 words.\
                                Highlight actions/items, and the emotions that is involved. \
                                 Break down the video description into 4 scenes of sequential order. \
                                    Generate potential alternate ways of speaking that is short for a comic. \
                                The description should only focus on the actions/items. Then, using this description, \
                                 generate an alternate reality for the following text that shows a better outcome, \
                                 for example, the alternate reality for late to work, is being early."])
print(f"{result.text=}")

### Image Generation using Vertex AI

# TODO(developer): Update and un-comment below lines
PROJECT_ID = "imagegenproject" 
#prompt = "cooking at a stovetop, carefully stirring a pot of soup"
#prompt = "A basketball cartoon player dribbling a basketball, wearing a basketball jersey, and a basketball hat. The player is in a basketball court, and the court is dimly lit."
prompt = result.text
         #\
           # The video shows a cartoon character sitting at a desk in a classroom, working on a laptop. He is wearing a dark gray jacket and glasses. The classroom is dimly lit." #+ result.text
#prompt = "A cartoon character engaging in a lecture, listening within a seat in the lecture hall, raising their hand to ask a question. \
    #In the image, display a speech bubble saying 'Hello world'" # The text prompt describing what you want to see.

vertexai.init(project=PROJECT_ID, location="us-central1")

model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")

count = 0

images = []

MAX_ATTEMPTS = 4

while len(images) <= 0 and count < MAX_ATTEMPTS: 
    # if count != 0: 
    #     prompt = genai.GenerativeModel("gemini-1.5-flash").generate_content([f"Modify the following to NOT include PEOPLE, \
    #                                                and make it more safe and appropriate: {prompt}"]).text
    #     print(f"Modified prompt: {prompt}")
    images = model.generate_images(
        prompt=prompt + f"Generate a image that is split into a grid that contains all 4 scenes. No need to include speech bubbles.",
           #Include speech bubbles for what is being said for each scene.",
        # Optional parameters
        number_of_images=1,
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
    for count, image in enumerate(images):
        image.save(location=f'output_{count}.png', include_generation_parameters=False)
        # Optional. View the generated image in a notebook.
        image.show()

        print(f"Created output image using {len(image._image_bytes)} bytes")
# Example response:
# Created output image using 1234567 bytes
else: 
    print("No images generated")