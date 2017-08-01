# Von https://www.gadgetdaily.xyz/build-a-3d-css-animated-menu/
import curses
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

servoMin = 0  # Min pulse length out of 4096
servoMax = 4095  # Max pulse length out of 4096
step = 10

def setDegree(channel, d):
    pwm.set_pwm(channel, 0, d)
    print d

# Set up curses for arrow input
scr = curses.initscr()
curses.cbreak()
scr.keypad(1)
scr.addstr(0, 0, "UP fuer mehr")
scr.addstr(1, 0, "DOWN fuer weniger")
scr.addstr(2, 0, "q to quit")
scr.refresh()

pulse = 430 # In Mittelposition beginnen
setDegree(0, pulse)

key = ''
while key != ord('q'):
    key = scr.getch()

    if key == curses.KEY_DOWN:
       pulse += step

       setDegree(0, pulse)

    elif key == curses.KEY_UP:
       pulse -= step

       setDegree(0, pulse)

curses.endwin()
