import Adafruit_PCA9685
import time

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

def hand_auf():
    pwm.set_pwm(2, 0, 570) # Handgelenk
    time.sleep(1)
    pwm.set_pwm(3, 0, 570) # Daumen
    time.sleep(1)
    pwm.set_pwm(4, 0, 570) # Zeigefinger
    time.sleep(1)
    pwm.set_pwm(5, 0, 570) # Mittelfinger
    time.sleep(1)
    pwm.set_pwm(6, 0, 570) # Ringfinger
    time.sleep(1)
    pwm.set_pwm(7, 0, 570) # Kleiner Finger
    time.sleep(1)

def hand_locker():
    pwm.set_pwm(2, 0, 430)
    time.sleep(1)
    pwm.set_pwm(3, 0, 430)
    time.sleep(1)
    pwm.set_pwm(4, 0, 430)
    time.sleep(1)
    pwm.set_pwm(5, 0, 430)
    time.sleep(1)
    pwm.set_pwm(6, 0, 430)
    time.sleep(1)
    pwm.set_pwm(7, 0, 430)
    time.sleep(1)
    pwm.set_pwm(2, 0, 0)
    pwm.set_pwm(3, 0, 0)
    pwm.set_pwm(4, 0, 0)
    pwm.set_pwm(5, 0, 0)
    pwm.set_pwm(6, 0, 0)
    pwm.set_pwm(7, 0, 0)

hand_auf()
hand_locker()
