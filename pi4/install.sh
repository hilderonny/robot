#!/bin/sh
# PI 4 ist der Steuerer fuer die Kopfservos

echo "Installing PI 4..."

echo "Installing packages ..."
apt-get install python python-smbus i2c-tools python-pip python-dev
pip install --upgrade adafruit-pca9685
#mkdir -p /github/adafruit
#git clone https://github.com/adafruit/Adafruit_Python_PCA9685.git /github/adafruit/Adafruit_Python_PCA9685
#python /github/adafruit/Adafruit_Python_PCA9685/setup.py install
