/*
Wartet auf Servosteueranweisungen am seriellen Port
und leitet diese Bytes als Gradzahlen an einen Servo
an Pin 9 weiter.
*/
#include <Servo.h>

Servo servoPin9;
byte degree;
byte pos = 0;

void setup() {
  servoPin9.attach(9);
  Serial.begin(9600);
}

void loop() {
  while (Serial.available() == 0) {}
  degree = Serial.read();
  servoPin9.write(degree);
}

