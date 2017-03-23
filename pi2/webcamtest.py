import cv2

# Siehe https://github.com/log0/video_streaming_with_flask_example
 
camera = cv2.VideoCapture(-1)
file = "webcam.png"
while True:
	retval, image = camera.read()
	print retval
	cv2.imwrite(file, image)
