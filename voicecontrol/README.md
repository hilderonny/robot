# Sprachsteuerung

Hierfür verwende ich das ReSpeaker 4-Mic Array von SeedStudio.

http://www.seeed.cc, BN paypal@hildebrandt2014.d, PW 76048645247

## Mikrofon einrichten und Richtung erkennen

```
apt-get install git mc python-pip python-pyaudio python-numpy

pip install pixel-ring gpiozero

git clone https://github.com/respeaker/seeed-voicecard

./seeed-voicecard/install.sh

python ./mic_direction.py
```

## Spracherkennung mit PocketSphinx

https://github.com/slowrunner/Pi3RoadTest

https://howchoo.com/g/ztbhyzfknze/how-to-install-pocketsphinx-on-a-raspberry-pi

https://cmusphinx.github.io/wiki/raspberrypi/

https://cmusphinx.github.io/wiki/tutorialam/

```
wget https://sourceforge.net/projects/cmusphinx/files/sphinxbase/5prealpha/sphinxbase-5prealpha.tar.gz/download -O sphinxbase.tar.gz

wget https://sourceforge.net/projects/cmusphinx/files/pocketsphinx/5prealpha/pocketsphinx-5prealpha.tar.gz/download -O pocketsphinx.tar.gz

tar -xzvf sphinxbase.tar.gz

tar -xzvf pocketsphinx.tar.gz

apt-get install bison libasound2-dev swig

cd sphinxbase-5prealpha
./configure --enable-fixed
make && make install

cd ../pocketsphinx-5prealpha
./configure
make && make install

export LD_LIBRARY_PATH=/usr/local/lib 
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
```

Die Python-Bibliotheken werden danach nach ```/usr/local/lib/python2.7/dist-packages/ (sphinxbase,pocketsphinx)``` installiert.

Mit ```cat /proc/asound/cards``` lässt sich heraus finden, welche Nummer das Mikrofon hat. Sollte etwa so aussehen: ```1 [seeed4micvoicec] ...```.


## Oder mit Jasper

http://jasperproject.github.io/documentation/installation/


## Oder mit KALDI

https://github.com/kaldi-asr/kaldi

```
apt-get install automake autoconf libtool subversion libatlas3-base
cd kaldi/tools
extras/check_dependencies.sh

```

## Oder Online mit Mycroft

https://github.com/respeaker/mycroft-core

Endpunkt: https://api.cognitive.microsoft.com/sts/v1.0 (ab 19.03.2018 30 Tage gültig)
Schlüssel 1: f3ced3778b3d4100b23fd39696725649
Schlüssel 2: bf2f1257c10943f4a9a4de14d9ad9c30

```
cd mycroft-core/
cp example_creds.py creds.py
// Schlüssel 1 in creds.py eintragen
```

## Oder ganz anders

https://pypi.python.org/pypi/SpeechRecognition/
https://github.com/Uberi/speech_recognition

```
pip install SpeechRecognition
apt-get install libpulse-dev
pip install pocketsphinx
apt-get install flac
python -m speech_recognition
python microphone_input.py (in diesem Verzeichnis hier)
```

Danach schreibt er zumindest, was ich auf englisch spreche.
Für deutsche Erkennung muss die Datei de-DE.tar.gz nach ```/usr/local/lib/python2.7/dist-packages/speech_recognition/pocketsphinx-data``` entpackt werden.

Mit dem Text "Sag mal warum dauert das so lange." sieht man bei ```python microphone_recognition.py```, dass Sphinx sehr ungenau ist, Google und Bing korrekt antworten und Bing sowohl Großschreibung korrekt macht, als auch konstant zügig antwortet.

Bei noch längeren Sätzen braucht Sphinx eine halbe Ewigkeit. Die erhöhte Dauer bei den Onlinediensten ist wohl auf die Übertragung der WAV-Datei zurück zu führen. Google dauert zwar länger als Bing, scheint dabei aber exaktere Ergebnisse zu liefern, trotz der fehlenden Großschreibung.