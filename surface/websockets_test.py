# -*- coding: iso-8859-1 -*-
'''
Einfaches Websocket - Programm, welches zyklisch
Nachrichten an die Clients schickt und Nachrichten
von Clients einfach zurück gibt. Basiert auf
https://github.com/mattmakai/python-websockets-example
Eventlet muss installiert sein, sonst nutzt socketio den LongPolling 
Fallback anstelle von richtigen Websockets
Bilder über Websockets: https://gist.github.com/companje/b95e735650f1cd2e2a41
pip install flask
pip install flask-socketio
pip install eventlet
'''
from flask import Flask, render_template
from flask_socketio import SocketIO

# Webserver liefert html-Datei aus templates-Verzeichnis
# Statische Dateien liegen im static-Verzeichnis (http://flask.pocoo.org/docs/0.12/quickstart/#static-files)
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('websockets_test.html')

# Websocket Server, broadcasted eingehende Nachrichten
socketio = SocketIO(app)
@socketio.on('message')
def ws_message(message):
    print message
    socketio.emit('message', message)

if __name__ == '__main__':
    socketio.run(app, host = '0.0.0.0', port = 80)
    print 'Laeuft.'