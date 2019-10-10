import cv2
import numpy as np

capture2 = cv2.VideoCapture(2)
capture4 = cv2.VideoCapture(4)

# Aufloesung runter skalieren
capture2.set(cv2.CAP_PROP_FRAME_WIDTH,320);
capture2.set(cv2.CAP_PROP_FRAME_HEIGHT,240);
capture4.set(cv2.CAP_PROP_FRAME_WIDTH,320);
capture4.set(cv2.CAP_PROP_FRAME_HEIGHT,240);

while True:
    _, frame2 = capture2.read()
    _, frame4 = capture4.read()
    sidebyside = np.concatenate((frame2, frame4), axis=1)
    cv2.imshow("sidebyside",sidebyside)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
capture2.release()
capture4.release()
cv2.destroyAllWindows()