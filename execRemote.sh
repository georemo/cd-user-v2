#!/bin/bash

# Variables
REMOTE_USER="root"
REMOTE_HOST="asdap.net"
REMOTE_SCRIPT="/home/devops/updateCdUser.sh"
SSH_KEY="$HOME/.ssh/id_rsa"

# SSH into the remote machine and execute the script
# ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u devops bash -s" < "${REMOTE_SCRIPT}"
ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u devops bash -c 'sh $REMOTE_SCRIPT'"