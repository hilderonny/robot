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
import time

def WorkerFunction(wer, connection):
    while(True):
        if (connection.poll()):
            message = connection.recv()
            if message == 'quit':
                break
        print 'Hallo %s!' % wer
        time.sleep(1)

if __name__ == '__main__':
    print 'Starte Worker'
    mainConnection, workerConnection = Pipe()
    workerProcess = Process(target=WorkerFunction, args=('Welt', workerConnection, ))
    workerProcess.start()
    print 'ESC zum Beenden'
    while(True):
        key = ord(getch())
        print key
        if key == 27:
            mainConnection.send('quit')
            break

    workerProcess.join()
    print 'Beendet.'