#!/bin/bash

# Variables
# REMOTE_USER="root"
# REMOTE_HOST="asdap.net"
# REMOTE_SCRIPT="/home/devops/updateCdUser.sh"
# SSH_KEY="$HOME/.ssh/id_rsa"

# SSH into the remote machine and execute the script
# ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u devops bash -s" < "${REMOTE_SCRIPT}"
# ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u devops bash -c 'sh $REMOTE_SCRIPT'"

############################################
# sample ssh to aws frontend server:
# ssh -i ~/.ssh/aws_frontend.pem ubuntu@asdap.net
# Variables
PROJ_NAME="cd-user"
UPDATE_FILE_NAME="updateCdUser.sh"

# user at digitalochean
# REMOTE_USER="root"

# user at aws frontend server
REMOTE_USER="ubuntu"

# remote hostname at digitalocean
# REMOTE_HOST="cd-shell.asdap.africa"

# remote hostname at aws frontend server
REMOTE_HOST="asdap.net"

REMOTE_SCRIPT="/home/$REMOTE_USER/$UPDATE_FILE_NAME"

# ssh key to digitalocean
# SSH_KEY="$HOME/.ssh/id_rsa" 

# ssh key to aws frontend server
SSH_KEY="$HOME/.ssh/aws_frontend.pem"

# SSH into the remote machine and execute the script
# ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u devops bash -s" < "${REMOTE_SCRIPT}"
ssh -i "${SSH_KEY}" "${REMOTE_USER}@${REMOTE_HOST}" "sudo -H -u ubuntu bash -c 'sh $REMOTE_SCRIPT'"