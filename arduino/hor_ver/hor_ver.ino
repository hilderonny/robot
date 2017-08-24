/*
 * Leitet serielle Signale an Servos an Pin 8 und 9 weiter.
 * 1. Byte: Pin (8 oder 9)
 * 2. Byte: Gradzahl (0 bis 180)
 * Baudrate: 9600
*/
#include <Servo.h>

Servo servoPin8, servoPin9;
byte pin, degree;

void setup() {
  servoPin8.attach(8);
  servoPin9.attach(9);
  Serial.begin(115200);
  servoPin8.write(90);
  servoPin9.write(90);
}

void loop() {
  if (Serial.available() > 3) {
    pin = Serial.read();
    degree = Serial.read();
    if (pin == 8) servoPin8.write(degree);
    else if (pin == 9) servoPin9.write(degree);
  }
}

