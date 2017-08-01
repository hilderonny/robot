# Zentriert den dritten angeschlossenen Servo auf 90 Grad
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

def setRotation(channel, degrees):
    pulse = degrees * 4096 / 180
    pwm.set_pwm(channel, 0, pulse)
    print pulse

setRotation(0, 90)
