#!/bin/bash -e

##################
# POSTTEST script #
##################
#

if groups |grep -c docker ; then
  SUDO_CMD=
else
  SUDO_CMD=sudo
fi

log() {
  echo """
################################################################################

$(date --iso-8601=seconds): $1

  """
}

log "Stopping compose..."

docker-compose down

log "Stopped."
