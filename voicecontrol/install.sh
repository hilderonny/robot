# Automatisch alles installieren, was man zum Hören und Sprechen braucht.
# Kann auf jungfräulichem Raspi ausgeführt werden, sofern für diesen die
# Netzwerkanmeldung schon gemacht wurde.
# Muss vom Benutzer "pi" aus aufgerufen werden.
# - Wechselt in Verzeichnis /home/pi, um dieses hier nicht vollzumüllen
# - Mikrofon Array installieren
# - Sprachausgabe einrichten
# - Spracherkennung einrichten

set -e

echo -e "\e[32mWechsle Verzeichnis zu /home/pi\e[0m"
cd /home/pi

echo -e "\e[32mInstalliere Vorbedingungen für Mikrofonarray\e[0m"
sudo apt install python-pip python-pyaudio python-numpy
sudo pip install pixel-ring gpiozero

echo -e "\e[32mLade Treiber und Programme für Mikrofonarray\e[0m"
git clone https://gitlab.com/hilderonny/seeed-voicecard

echo -e "\e[32mInstalliere Treiber und Programme für Mikrofonarray\e[0m"
sudo ./seeed-voicecard/install.sh


echo -e "\e[32mInstalliere Basispaket für MBROLA Stimmen\e[0m"
sudo apt install ./mbrola3.0.1h_armhf.deb

echo -e "\e[32mInstalliere espeak\e[0m"
sudo apt install espeak python-espeak

echo -e "\e[32mInstalliere MBROLA Stimmen\e[0m"
sudo apt install ./mbrola-de5_1.0+repack2-4_all.deb
sudo apt install ./mbrola-de6_0.0.20021125+repack2-5_all.deb

