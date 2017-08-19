# -*- coding: iso-8859-1 -*-
'''
Testet die Nachrichteninteraktion zwischen zwei Prozessen
Der Hauptprozess wartet auf Benutzereingaben und sendet dem
zweiten Prozess Abbruch-Nachrichten zu.
Anfangstest, um später Webcam-Capturing und Flask Providing
in separate Prozesse zu verlagern.
'''
from multiprocessing import Process, Pipe
from msvcrt import getch
import numpy as np
import cv2


def WorkerFunction(connection):
    cap1 = cv2.VideoCapture(0)
    frame1 = False
    while(True):
        if (connection.poll()):
            message = connection.recv()
            if message == 'quit':
                cap1.release()
                cv2.destroyAllWindows()
                break
            if message == 'frame':
                connection.send(frame1)
        cap1.grab()
        ret1, frame1 = cap1.retrieve()
        cv2.waitKey(1)

if __name__ == '__main__':
    print 'Starte Worker'
    mainConnection, workerConnection = Pipe()
    workerProcess = Process(target=WorkerFunction, args=(workerConnection, ))
    workerProcess.start()
    print 'ESC zum Beenden, f für Frame'
    while(True):
        key = ord(getch())
        print key
        if key == 27:
            mainConnection.send('quit')
            break
        if key == 102: # f
            # Letztes Frame anfragen und ausgeben
            mainConnection.send('frame')
            frame = mainConnection.recv()
            cv2.imshow('Preview', frame)
            cv2.waitKey(1)

    workerProcess.join()
    print 'Beendet.'