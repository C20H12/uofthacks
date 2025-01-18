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

# Example usage:
image_path = "output_3.png" 
base64_image = image_to_base64(image_path)

def base64_to_image(base64_string, filename):
    try:
        with open(filename, "wb") as image_file:
            image_file.write(base64.b64decode(base64_string))
    except FileNotFoundError:
        print(f"File not found: {image_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

def video_to_base64(video_path):
    with open(video_path, "rb") as video_file:
        base64_string = base64.b64encode(video_file.read()).decode("utf-8")
        return base64_string

def base64_to_video(base64_string, filename):
  """
  Converts a Base64-encoded string to a video file.

  Args:
    base64_string: The Base64-encoded string representing the video data.
    filename: The desired filename for the output video file (e.g., "output.mp4").

  """
  with open(filename, "wb") as video_file:
    video_file.write(base64.b64decode(base64_string))

# Example usage:
base64_encoded_video = video_to_base64("output.mov") 
#base64_to_video(base64_encoded_video, "output.mp4") 

# if base64_image:
#   print(base64_image)
#   base64_to_image(base64_image, "decoded_image.png")

if base64_encoded_video:
   base64_to_video(base64_encoded_video, "decoded_video.mp4")
