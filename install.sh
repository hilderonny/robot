#!/bin/sh

# Macht erste Einstellungen und laedt das GitLab-Repository herunter.

# Bash farbig machen: https://misc.flogisoft.com/bash/tip_colors_and_formatting
# Script bei Fehler abbrechen lassen: https://intoli.com/blog/exit-on-errors-in-bash-scripts/
set -e

# Pruefen, ob als root ausgefuehrt
if [ $(id -u) -ne 0 ]; then
        echo "Please run as root or sudo"
        exit 0
fi

apt update
apt upgrade
apt install git
#curl -sL https://deb.nodesource.com/setup_8.x | bash -
#apt-get install -y nodejs

git config credential.helper store
git clone https://hilderonny@gitlab.com/hilderonny/robot.git

exit 0
