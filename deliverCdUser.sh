#!/bin/bash

clear

# Source and destination directories
PROJ_NAME="cd-user"
PROJ_DIR="$HOME/cd-projects/$PROJ_NAME"
DIST_DIR="$HOME/cd-projects/$PROJ_NAME-dist"
SOURCE_DIR="$HOME/cd-projects/$PROJ_NAME/dist/$PROJ_NAME"
DEST_DIR="$HOME/cd-projects/$PROJ_NAME-dist"

cd "$PROJ_DIR"

echo "\n----------------------------------------------------"
echo "UPDATE cd libs"
echo "----------------------------------------------------"
npm i @corpdesk/core@latest @corpdesk/naz@latest --legacy-peer-deps

echo "\n----------------------------------------------------"
echo "BUILD $PROJ_NAME"
echo "----------------------------------------------------"
ng build $PROJ_NAME


echo "\n----------------------------------------------------"
echo "COPY dist files to $PROJ_NAME project"
echo "----------------------------------------------------"
# Copy the contents of the source directory to the destination directory recursively
# The --exclude option ensures that .git directories are not copied
rsync -av --delete --exclude '.git' "$SOURCE_DIR"/ "$DEST_DIR"

# Verify the operation
if [ $? -eq 0 ]; then
  echo "Contents copied successfully from $SOURCE_DIR to $DEST_DIR"
else
  echo "An error occurred while copying the contents."
fi

###########################################
# SYNC WITH REPOSITORY
echo "\n----------------------------------------------------"
echo "SYNC WITH $PROJ_NAME-dist REPOSITORY"
echo "----------------------------------------------------"

cd "$DIST_DIR"
echo "current directory:"
echo $(pwd)

# Add all changes to the staging area
git add .

# Commit the changes with the provided commit message
git commit -m "-"

# Check if the commit was successful
if [ $? -ne 0 ]; then
  echo "Commit failed. Please check the error messages above."
  exit 1
fi

# Force push to the specified branch
git push --force

# Check if the push was successful
if [ $? -eq 0 ]; then
  echo "Changes have been force-pushed to the remote repository."
else
  echo "Failed to push changes. Please check the error messages above."
  exit 1
fi

echo "\n----------------------------------------------------"
echo "UPDATE REMOTE DEPLOYMENT"
echo "----------------------------------------------------"
sh "$PROJ_DIR/execRemote.sh"

# Get the current date
current_date=$(date +"%A, %B %d, %Y %I:%M:%S %p")

# Output the current date
echo "Current Date and Time: $current_date"