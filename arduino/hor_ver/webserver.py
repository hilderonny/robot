# -*- coding: iso-8859-1 -*-
'''
Roboterkopf über Weboberfläche steuern
pip install flask
pip install flask-socketio
pip install eventlet
pip install pyserial
'''
from multiprocessing import Process, Pipe
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import serial
import time

mainConnection, workerConnection = Pipe()

def WorkerFunction(connection):
    serialPort = 'COM4'
    baudRate = 115200
    horiz = 90
    vert = 90

    serialConnection = serial.Serial(serialPort, baudRate, timeout=.1)
    time.sleep(2) # Auf Auto-Reset warten (https://playground.arduino.cc/Main/DisablingAutoResetOnSerialConnection)

    while(True):
        if (connection.poll()):
            message = connection.recv()
            horiz = int(message['horiz'])
            vert = int(message['vert'])
            if horiz < 70:
                horiz = 70
            if horiz > 110:
                horiz = 110
            if vert < 30:
                vert = 30
            if vert > 150:
                vert = 150
            serialConnection.write(bytearray([8, horiz]))
            serialConnection.write(bytearray([9, vert]))

app = Flask(__name__)
@app.route('/')
def index():
    return app.send_static_file('webserver.html')


socketio = SocketIO(app, binary=True)
@socketio.on('move')
def ws_move(requestObject):
    global mainConnection
    mainConnection.send(requestObject)

if __name__ == '__main__':
    # Arbeitsprozess
    workerProcess = Process(target=WorkerFunction, args=(workerConnection, ))
    workerProcess.start()
    # Server
    socketio.run(app, host = '0.0.0.0', port = 80)
