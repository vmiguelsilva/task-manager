#!/bin/bash -e

##################
# PRETEST script #
##################
#

# Retrieve current dir
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export $(egrep -v '^#' .env | xargs)

# If current user is in `docker` group, run docker without sudo
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

./.docker/commands/poststart-dev.sh

log "Running dependencies..."
$SUDO_CMD docker-compose -f docker-compose.development.yaml up -d

awaitZookeeperInitialization() {
  until $SUDO_CMD docker logs ZOOKEEPER | grep -i binding; do
    sleep 1
    echo "Waiting for ZOOKEEPER initialization"
  done
}

awaitZookeeperInitialization
log "ZOOKEEPER initialized"

awaitKafkaInitialization() {
  until $SUDO_CMD docker logs KAFKA | grep -i started; do
    sleep 1
    echo "Waiting for KAFKA initialization"
  done
}

awaitKafkaInitialization
log "KAFKA initialized"

log "Seed"
npm run seed:users

log "Started"