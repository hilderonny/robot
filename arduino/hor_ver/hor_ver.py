# -*- coding: iso-8859-1 -*-
'''
Kommuniziert mit hor_ver.ino, welches auf Arduino installiert sein muss.
Reagiert auf Pfeiltasten und lenkt Servos aus.
Rechts/Links: Servo an Pin 8
Oben/Unten: Servo an Pin 9

Installation:
pip install pyserial
'''
import serial
import time
import msvcrt

serialPort = 'COM4'
baudRate = 115200
horDeg = 90
vertDeg = 90

serialConnection = serial.Serial(serialPort, baudRate, timeout=.1)
time.sleep(2) # Auf Auto-Reset warten (https://playground.arduino.cc/Main/DisablingAutoResetOnSerialConnection)

def steer(pin, degree):
    global serialConnection
    serialConnection.write(bytearray([pin, degree])) 
    #serialConnection.write(chr(pin))
    #serialConnection.write(chr(degree))
    #while True:
    #    data = serialConnection.readline()
    #    if data:
    #        print(data)
    #        break

def up():
    global vertDeg
    if (vertDeg < 180):
        vertDeg = vertDeg + 1
        steer(9, vertDeg)
        print "V: %s" % vertDeg

def down():
    global vertDeg
    if (vertDeg > 0):
        vertDeg = vertDeg - 1
        steer(9, vertDeg)
        print "V: %s" % vertDeg

def right():
    global horDeg
    if (horDeg < 180):
        horDeg = horDeg + 1
        steer(8, horDeg)
        print "H: %s" % horDeg

def left():
    global horDeg
    if (horDeg > 0):
        horDeg = horDeg - 1
        steer(8, horDeg)
        print "H: %s" % horDeg

print "Pfeiltasten zum Steuern, ESC zum Beenden"

# Hoch: 72, Runter: 80, Links: 75, Rechts: 77, ESC: 27

while True:
    if msvcrt.kbhit():
        keyHit = ord(msvcrt.getch())
        if keyHit == 72:
            up()
        if keyHit == 80:
            down()
        if keyHit == 75:
            right()
        if keyHit == 77:
            left()
        if keyHit == 27:
            break

serialConnection.close()