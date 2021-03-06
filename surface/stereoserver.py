# -*- coding: iso-8859-1 -*-
'''
Zwei Webcams über Websockets streamen
https://gist.github.com/companje/b95e735650f1cd2e2a41
pip install flask
pip install flask-socketio
pip install eventlet
'''
from multiprocessing import Process, Pipe
import numpy as np
import cv2
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

mainConnection, workerConnection = Pipe()
def WorkerFunction(connection):
    brightness = 75
    cap1 = cv2.VideoCapture(2)
    cap2 = cv2.VideoCapture(3)
    frame = False
    quality = 75
    while(True):
        if (connection.poll()):
            message = connection.recv()
            if message['type'] == 'frame':
                connection.send(frame)
            if message['type'] == 'quality':
                quality = int(message['value'])
            if message['type'] == 'brightness':
                brightness = float(message['value'])
                cap1.set(cv2.cv.CV_CAP_PROP_BRIGHTNESS, brightness)
                cap2.set(cv2.cv.CV_CAP_PROP_BRIGHTNESS, brightness)
        cap1.grab()
        cap2.grab()
        ret1, raw1 = cap1.retrieve()
        ret2, raw2 = cap2.retrieve()

        beside = np.concatenate((raw1, raw2), axis=1)

        cv2.putText(beside, "Quality: %s Brightness: %s" % (quality, brightness), (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255))

        ret, arr = cv2.imencode('.jpg', beside, [cv2.IMWRITE_JPEG_QUALITY, quality])
        frame = bytes(bytearray(arr))
        cv2.waitKey(1)


app = Flask(__name__)
@app.route('/')
def index():
    return render_template('stereoserver.html')


socketio = SocketIO(app, binary=True)
@socketio.on('getimage')
def ws_getimage():
    global mainConnection
    mainConnection.send({'type': 'frame'})
    frame = mainConnection.recv()
    emit(u"image", frame)
@socketio.on('setquality')
def ws_setquality(q):
    print "Setting quality to %s" % q
    mainConnection.send({'type': 'quality', 'value':q})
    socketio.emit(u"quality", q)
@socketio.on('setbrightness')
def ws_setbrightness(v):
    print "Setting brightness to %s" % v
    mainConnection.send({'type': 'brightness', 'value':v})
    socketio.emit(u"brightness", v)

if __name__ == '__main__':
    # Webcam
    workerProcess = Process(target=WorkerFunction, args=(workerConnection, ))
    workerProcess.start()
    # Server
    socketio.run(app, host = '0.0.0.0', port = 80)
