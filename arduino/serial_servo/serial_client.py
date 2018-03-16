# -*- coding: iso-8859-1 -*-
'''
Kommuniziert mit serial_servo.ino, welches auf Arduino installiert sein muss.
Lässt den Servo an Pin 9 zwischen 70 und 110 Grad schwenken.

Siehe: https://playground.arduino.cc/Interfacing/Python

Installation:
pip install pyserial
'''
import serial
import time
import struct

serialPort = 'COM4'
baudRate = 9600

serialConnection = serial.Serial(serialPort, baudRate, timeout=1)
time.sleep(2) # Auf Auto-Reset warten (https://playground.arduino.cc/Main/DisablingAutoResetOnSerialConnection)
serialConnection.write(chr(70))
print "70"
time.sleep(2)
serialConnection.write(chr(110))
print "110"
time.sleep(2)
serialConnection.write(chr(90))
print "90"
serialConnection.close()