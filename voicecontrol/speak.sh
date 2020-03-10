#!/bin/bash

# Dieses Skript wartet auf Text in der Konsole und spricht den Text mit espeak.
# Die Eingabe wird mit Enter abgeschlossen

echo "Text eingeben und ENTER druecken:"
while true
do
    read txt
    espeak -s 120 -v mb-de5 --stdout "$txt" | aplay -
done
