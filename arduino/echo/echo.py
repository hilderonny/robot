import serial, time
print("Initializing")
arduino = serial.Serial('COM4', 115200, timeout=.1)
time.sleep(2) #give the connection a second to settle
print("Sending")
arduino.write(chr(8))
print("Receiving")
while True:
	data = arduino.read()
	if data:
		print ord(data)