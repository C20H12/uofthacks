from flask import Flask, request
import google.generativeai as genai
#from google import genai
import os
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

import time

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Uploads a video file to the backend, which will have AI process the video file and return a text description of the video.
# Also contains options for AI to consider when generating text
@app.route('/upload', methods=['POST'])
def upload():
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

if __name__ == '__main__':
    app.run(debug=True)

