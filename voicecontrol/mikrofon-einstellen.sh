#!/bin/sh

# Das Script nimmt 3 Sekunden mit dem Mikrofon auf und spielt die Aufnahme danach ab.
# Dient zur Justierung von Mikrofonen

while :
do
	echo "Aufnahme ..."
	arecord -f dat -d 3 temp.wav
	echo "Playback"
	aplay temp.wav
	rm temp.wav
done
