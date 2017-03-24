# Zentriert beide Servos zum Aurichten
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()

horizontal_mitte = 300
vertikal_mitte = 350

pwm.set_pwm_freq(60)

pwm.set_pwm(0, 0, vertikal_mitte)
pwm.set_pwm(1, 0, horizontal_mitte)
