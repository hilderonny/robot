from flask import Flask, render_template, Response
import time
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)

horizontal_mitte = 300
vertikal_mitte = 350

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move/<int:port>/<int:value>')
def move(port, value):
    if port >= 0 and port < 16 and value > 0 and value < 600:
        pwm.set_pwm(port, 0, value)
    return 'Port {0} Value {1}'.format(port, value)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True,port=80)
