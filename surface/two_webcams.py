'''
Verwendet zwei Webcams und vereinigt die beiden Bilder zu einem
Bild und zeigt dieses in einem Fenster samt FPS Counter an.
Sinnvoll für die LifeCam 3000.
'''
import numpy as np
import cv2

cap1 = cv2.VideoCapture(0)
cap2 = cv2.VideoCapture(1)

ticks = cv2.getTickCount()
freq = cv2.getTickFrequency()

while(True):
    cap1.grab() # So sehen die Kameras synchroner aus, siehe http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html#videocapture-grab
    cap2.grab()
    ret1, frame1 = cap1.retrieve()
    ret2, frame2 = cap2.retrieve()

    beside = np.concatenate((frame1, frame2), axis=1)

    now = cv2.getTickCount()
    diff = now - ticks
    fps = freq / diff

    cv2.putText(beside, "%s" % (fps), (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255))

    ticks = now

    cv2.imshow('beside', beside)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    ticks = cv2.getTickCount()

cap1.release()
cv2.destroyAllWindows()
