import speech_recognition as sr
from datetime import datetime

#lang = "en-US"
lang = "de-DE"

# obtain audio from the microphone
r = sr.Recognizer()
with sr.Microphone() as source:
    print("Say something!")
    audio = r.listen(source)
    print("Got you!")

# recognize speech using Sphinx
try:
    print("Asking Sphinx...")
    a = datetime.now()
    print("Sphinx thinks you said: " + r.recognize_sphinx(audio, language=lang))
    print (datetime.now() - a).total_seconds()
except sr.UnknownValueError:
    print("Sphinx could not understand audio")
except sr.RequestError as e:
    print("Sphinx error; {0}".format(e))

# recognize speech using Google Speech Recognition
try:
    # for testing purposes, we're just using the default API key
    # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
    # instead of `r.recognize_google(audio)`
    print("Asking Google...")
    a = datetime.now()
    print("Google Speech Recognition thinks you said: " + r.recognize_google(audio,language=lang))
    print (datetime.now() - a).total_seconds()
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))

# recognize speech using Microsoft Bing Voice Recognition
BING_KEY = "f3ced3778b3d4100b23fd39696725649"  # Microsoft Bing Voice Recognition API keys 32-character lowercase hexadecimal strings
try:
    print("Asking Bing...")
    a = datetime.now()
    print("Microsoft Bing Voice Recognition thinks you said: " + r.recognize_bing(audio, key=BING_KEY, language=lang))
    print (datetime.now() - a).total_seconds()
except sr.UnknownValueError:
    print("Microsoft Bing Voice Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Microsoft Bing Voice Recognition service; {0}".format(e))
