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

if base64_image:
  print(base64_image)