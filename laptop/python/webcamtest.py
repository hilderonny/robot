import cv2
import numpy as np

capture0 = cv2.VideoCapture(0) # /dev/video0 ist die eingebaute Webcam
capture2 = cv2.VideoCapture(2) # /dev/video2 ist die erste USB Kamera
capture4 = cv2.VideoCapture(4) # /dev/video4 ist die zweite USB Kamera

while True:
    _, frame0 = capture0.read()
    _, frame2 = capture2.read()
    _, frame4 = capture4.read()
    sidebyside = np.concatenate((frame0, frame2, frame4), axis=1)
    cv2.imshow("frame0",frame0)
    cv2.imshow("frame2",frame2)
    cv2.imshow("frame4",frame4)
    cv2.imshow("sidebyside",sidebyside)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
capture0.release()
capture2.release()
capture4.release()
cv2.destroyAllWindows()