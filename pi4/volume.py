# Von https://www.gadgetdaily.xyz/build-a-3d-css-animated-menu/
import curses
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

servoMin = 150  # Min pulse length out of 4096
servoMax = 600  # Max pulse length out of 4096
maxDegree = 180 # Degrees your servo can rotate
degIncrease = 2 # Number of degrees to increase by each time

def setDegree(channel, d):
    degreePulse = servoMin
    degreePulse += int((servoMax - servoMin) / maxDegree) * d
    pwm.set_pwm(channel, 0, degreePulse)
    print d

# Set up curses for arrow input
scr = curses.initscr()
curses.cbreak()
scr.keypad(1)
scr.addstr(0, 0, "Servo Volume Control")
scr.addstr(1, 0, "UP to increase volume")
scr.addstr(2, 0, "DOWN to decrease volume")
scr.addstr(3, 0, "q to quit")
scr.refresh()

degree = 90 # Start off at lowest volume
setDegree(0, degree)

key = ''
while key != ord('q'):
    key = scr.getch()

    if key == curses.KEY_DOWN:
       degree += degIncrease

       if degree > maxDegree:
          degree = maxDegree

       setDegree(0, degree)

    elif key == curses.KEY_UP:
       degree -= degIncrease

       if degree < 0:
          degree = 0

       setDegree(0, degree)

curses.endwin()
