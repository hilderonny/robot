# Testet den horizontalen Servo
from __future__ import division
import time
import Adafruit_PCA9685

# Initialise the PCA9685 using the default address (0x40).
pwm = Adafruit_PCA9685.PCA9685()

# Configure min and max servo pulse lengths
servo_min = 150  # Rechts
servo_mitte = 300
servo_max = 550  # Links

# Set frequency to 60hz, good for servos.
pwm.set_pwm_freq(60)

print('Moving servo on channel 1, press Ctrl-C to quit...')
while True:
    # Move servo on channel O between extremes.
    pwm.set_pwm(1, 0, servo_min)
    time.sleep(1)
    pwm.set_pwm(1, 0, servo_mitte)
    time.sleep(1)
    pwm.set_pwm(1, 0, servo_max)
    time.sleep(1)
    pwm.set_pwm(1, 0, servo_mitte)
    time.sleep(1)
