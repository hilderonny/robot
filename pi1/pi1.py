# Webserver mit Socket
from flask import Flask
from speak import *

app = Flask(__name__)

@app.route("/")
def hello():
	speak('Da will einer was')
	return 'Wassn los?'

if __name__ == '__main__':
	speak('Ich bin bereit.')
	app.run(host='0.0.0.0',port=80)
