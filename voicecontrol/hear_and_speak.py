# -*- coding: utf-8
import speech_recognition as sr
import os

def printsay(text):
    print text
    # https://www.raspberrypi.org/forums/viewtopic.php?t=47942#p414218
    os.system("espeak -s 130 --stdout -v mb-de5 \"" + text + "\" | aplay > /dev/null 2>&1")

r = sr.Recognizer()
with sr.Microphone() as source:
    printsay("Sag was!")
    audio = r.listen(source)
    printsay("Hab's gehört, mal sehen, was das war...")

try:
    # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
    text = r.recognize_google(audio, language="de-DE")
    printsay("Du sagtest: " + text)

except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))
