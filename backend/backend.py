from flask import Flask, request
from flask_cors import CORS, cross_origin
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
#from google import genai
import os
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from flask import jsonify
#from flask_socketio import SocketIO, emit

import time
import base64
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
#socketio = SocketIO(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
  
def base64_to_video(base64_string, filename):
  """
  Converts a Base64-encoded string to a video file.

  Args:
    base64_string: The Base64-encoded string representing the video data.
    filename: The desired filename for the output video file (e.g., "output.mp4").

  """
  with open(filename, "wb") as video_file:
    video_file.write(base64.b64decode(base64_string))

@app.route('/')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def index():
    return "Hello, World!"

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@app.route('/test_video', methods=['POST', 'GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def test_video():
    return "Hello, uploads!"

status = "Uploading video..."

@app.route('/status', methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def status():
    global status
    return jsonify({"status": status})

# Uploads a video file to the backend, which will have AI process the video file and return a text description of the video.
# Also contains options for AI to consider when generating text
@app.route('/upload_video', methods=['POST', 'GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def upload_video():
    global status
    gen_txt_json = request.get_json()
    base64_string = gen_txt_json['video_file']
    prompt_options = gen_txt_json['options']

    print("Received the following base64 string: ")
    print(f"{base64_string=}")
    base64_to_video(base64_string, "uploaded_file.mp4")
    status = "video received"
    print(f"{prompt_options=}")
    #emit("video_upload", {"status": "video received"}, broadcast=True);
    #file.save('uploaded_file.mp4')
    myfile = genai.upload_file("uploaded_file.mp4")
    print(f"{myfile=}")
    status = "Uploaded to Google Model"
    #emit("video_upload", {"status": "Uploaded to Google Model"}, broadcast=True);
    # Videos need to be processed before you can use them.
    while myfile.state.name == "PROCESSING":
        print("processing video...")
        time.sleep(5)
        myfile = genai.get_file(myfile.name)
    status = "Generating text"
    #emit("video_upload", {"status": "Generating text"}, broadcast=True);

    prompt_options_str = "" 
    for count, option in enumerate(prompt_options):
        prompt_options_str += f"{count+1}. {option}, \n"

    prompt_describe = f"Describe this video clip, DO NOT mention people in the description. Instead replace with cartoon characters. \
                                    KEEP the description within 50 words.\
                                    Highlight actions/items, and the emotions that is involved. \
                                    Take into consideration the following options: \n{prompt_options_str}"
    
    print(f"{prompt_describe=}")
                                    
                                    
    prompt_alternate = f"Based on {prompt_describe}, generate an alternate reality for the following text that shows a better outcome. \
                                    DO NOT mention people in the description. Instead replace with cartoon characters. \
                                    For example, the alternate reality for late to work, is being early. \
                                    The description should only focus on actions/items."

    model = genai.GenerativeModel("gemini-1.5-flash")
    result_describe = model.generate_content([myfile, prompt_describe])
    print("*********DESCRIBE*********")
    print(f"{result_describe.text=}")
    results_alternate = []

    print("*********ALTERNATE REALITIES*********")
    num_alternates = 2
    for i in range(num_alternates):
        result_alternate = model.generate_content([myfile, prompt_alternate])
        print(f"Alternate {i}: {result_alternate.text}")
        results_alternate.append(result_alternate.text)
    #return result.text
    return jsonify({"description": result_describe.text, "alternates": results_alternate})

PROJECT_ID = "imagegenproject" 
vertexai.init(project=PROJECT_ID, location="us-central1")
model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
MAX_ATTEMPTS = 2

@app.route('/generate_image', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def generate_image():
    try: 
        prompt = request.get_json()['text']
        print(f"Received the following prompt: {prompt}")
        count = 0

        images = []

        while len(images) <= 0 and count < MAX_ATTEMPTS: 
            print(f"Attempt {count} for generating images")
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

                return jsonify({"response": gen_images})
        # Example response:
        # Created output image using 1234567 bytes
        else: 
            print("No images generated")
            return jsonify({"response": []})
    except ResourceExhausted as e: 
       print(f"Resource exhausted - quota exceeded: {e}")
       return jsonify({"response": "Quota exceeded"})

if __name__ == '__main__':
    app.run(debug=True)

