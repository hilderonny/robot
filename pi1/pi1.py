# -*- coding: utf-8 -*-
# Webserver mit Socket
from flask import Flask, request
from speak import *
from subprocess import call
import json, io, os.path

app = Flask(__name__)

settings = { 'volume' : 80 }

def readSettings():
	if os.path.isfile('settings.json'):
		with io.open('settings.json') as infile:
			settings = json.load(infile)

def writeSettings():
	with io.open('settings.json', 'w', encoding='utf8') as outfile:
		outfile.write(unicode(json.dumps(settings)))

def setzeLautstaerke():
	readSettings()
	call(['amixer', 'set', 'PCM', '--', '{}%'.format(settings['volume'])])

@app.route('/update')
def update():
	speak('Beginne Aktualisierung')
	call(['git', '-C', '/gitlab/hilderonny/robot/', 'pull'])
	speak('Aktualisierung durchgeführt')
	return 'Update complete'

@app.route('/sprechen', methods=['POST'])
def sprechen():
	text = request.form['text']
	speak(text)
	return text

@app.route('/lauter')
def lauter():
	volume = settings['volume']
	if volume < 100:
		volume = volume + 5
		settings['volume'] = volume
		writeSettings()
		setzeLautstaerke()
		speak('Mache lauter')
	else:
		speak('Geht nicht lauter')
	return '{}'.format(volume)

@app.route('/leiser')
def leiser():
	volume = settings['volume']
	if volume > 0:
		volume = volume - 5
		settings['volume'] = volume
		writeSettings()
		setzeLautstaerke()
		speak('Mache leiser')
	else:
		speak('Geht nicht leiser')
	return '{}'.format(volume)

@app.route('/')
def index():
	speak('Da will einer was')
	return app.send_static_file('index.html')

if __name__ == '__main__':
	setzeLautstaerke()
	speak('Ich bin bereit.')
	app.run(debug=True,host='0.0.0.0',port=80)
