import Adafruit_PCA9685
import time

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

pwm.set_pwm(4, 0, 570) # Zeigefinger
pwm.set_pwm(7, 0, 570) # Kleiner Finger
time.sleep(3)
pwm.set_pwm(4, 0, 430)
pwm.set_pwm(7, 0, 430)
pwm.set_pwm(5, 0, 570)
time.sleep(3)
pwm.set_pwm(5, 0, 430)
time.sleep(1)
pwm.set_pwm(4, 0, 0)
pwm.set_pwm(5, 0, 0)
pwm.set_pwm(7, 0, 0)
