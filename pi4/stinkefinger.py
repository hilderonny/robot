import Adafruit_PCA9685
import time

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

pwm.set_pwm(5, 0, 570) # Mittelfinger
time.sleep(3)
pwm.set_pwm(5, 0, 430) # Mittelfinger
