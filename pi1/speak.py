# Modul und Applikation zur Sprachausgabe
# Applikation verwenden: python speak.py "Hallo Welt!"
# Modul verwenden:
# from speak import *
# speak('Hallo Welt!')
import subprocess
from thread import start_new_thread

def speakThread(text):
	subprocess.call(['pico2wave', '-l', 'de-DE', '-w', 'temp.wav', text])
	subprocess.call(['aplay', 'temp.wav'])
	subprocess.call(['rm', 'temp.wav'])
	print text

def speak(text):
	start_new_thread(speakThread,(text,))

if __name__ == '__main__':
	import sys
	speak(sys.argv[1])
